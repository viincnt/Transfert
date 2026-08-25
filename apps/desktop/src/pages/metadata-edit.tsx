import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import {
  CircleCheck,
  File as FileIcon,
  Loader2,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/dropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Same format restriction as Strip Metadata — see
// src-tauri/src/metadata/mod.rs for why.
const INPUT_FORMATS = ["JPG", "PNG", "TIFF", "WEBP"];

type MetadataFields = {
  artist?: string;
  copyright?: string;
  description?: string;
  dateTaken?: string;
  deviceMake?: string;
  deviceModel?: string;
};

type DeliveredFile = {
  fileName: string;
  path: string;
  size: number;
  sha256: string;
};

const EMPTY_FIELDS: MetadataFields = {};

export function MetadataEdit() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [fields, setFields] = useState<MetadataFields>(EMPTY_FIELDS);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [destinationDir, setDestinationDir] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<DeliveredFile | null>(null);

  useEffect(() => {
    if (!file) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setSaved(null);

    (async () => {
      try {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const result = await invoke<MetadataFields>("read_metadata_command", {
          bytes,
          fileName: file.name,
        });
        if (!cancelled) setFields(result);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [file]);

  function reset() {
    setFile(null);
    setFields(EMPTY_FIELDS);
    setError(null);
    setSaved(null);
  }

  async function pickDestination() {
    const selected = await open({ directory: true, multiple: false });
    if (typeof selected === "string") setDestinationDir(selected);
    return selected;
  }

  async function handleSave() {
    if (!file) return;
    let dir = destinationDir;
    if (!dir) {
      const selected = await pickDestination();
      if (typeof selected !== "string") return;
      dir = selected;
    }

    setIsSaving(true);
    setError(null);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const result = await invoke<DeliveredFile>("write_metadata_command", {
        bytes,
        fileName: file.name,
        destinationDir: dir,
        fields,
      });
      setSaved(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSaving(false);
    }
  }

  if (!file) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Dropzone
          title={t("metadataEdit.dropzone.title")}
          description={t("metadataEdit.dropzone.description")}
          formats={INPUT_FORMATS}
          accept="image/jpeg,image/png,image/tiff,image/webp"
          multiple={false}
          onFilesSelected={(files) => setFile(files[0] ?? null)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <div className="flex items-center gap-3 rounded-lg border p-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-muted">
          <FileIcon className="size-4 text-muted-foreground" />
        </div>
        <p className="min-w-0 flex-1 truncate text-sm font-medium">
          {file.name}
        </p>
        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcw />
          {t("metadataEdit.chooseAnother")}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          {t("metadataEdit.reading")}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 rounded-lg border p-4">
            <Field
              label={t("metadataEdit.fields.artist")}
              value={fields.artist ?? ""}
              onChange={(value) =>
                setFields((prev) => ({ ...prev, artist: value }))
              }
            />
            <Field
              label={t("metadataEdit.fields.copyright")}
              value={fields.copyright ?? ""}
              onChange={(value) =>
                setFields((prev) => ({ ...prev, copyright: value }))
              }
            />
            <Field
              label={t("metadataEdit.fields.description")}
              value={fields.description ?? ""}
              onChange={(value) =>
                setFields((prev) => ({ ...prev, description: value }))
              }
            />
            <Field
              label={t("metadataEdit.fields.dateTaken")}
              value={fields.dateTaken ?? ""}
              placeholder="YYYY:MM:DD HH:MM:SS"
              onChange={(value) =>
                setFields((prev) => ({ ...prev, dateTaken: value }))
              }
            />
            <Field
              label={t("metadataEdit.fields.deviceMake")}
              value={fields.deviceMake ?? ""}
              onChange={(value) =>
                setFields((prev) => ({ ...prev, deviceMake: value }))
              }
            />
            <Field
              label={t("metadataEdit.fields.deviceModel")}
              value={fields.deviceModel ?? ""}
              onChange={(value) =>
                setFields((prev) => ({ ...prev, deviceModel: value }))
              }
            />
          </div>

          <div className="flex flex-col gap-3 rounded-lg border p-4">
            <Label>{t("queue.destination.label")}</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={destinationDir ?? ""}
                placeholder={t("queue.destination.placeholder")}
              />
              <Button
                variant="outline"
                className="shrink-0"
                onClick={pickDestination}
              >
                {t("queue.destination.browse")}
              </Button>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {saved && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CircleCheck className="size-4 shrink-0 text-emerald-500" />
              {t("metadataEdit.saved", { fileName: saved.fileName })}
            </p>
          )}

          <Button size="lg" onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="animate-spin" />}
            {t("metadataEdit.save")}
          </Button>
        </>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
