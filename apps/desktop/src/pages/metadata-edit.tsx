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
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 px-6 py-4">
        <div>
          <p className="font-mono text-[10px] font-medium tracking-[0.14em] text-primary uppercase">
            Metadata editor
          </p>
          <p className="mt-1 text-sm font-medium">
            Review the details before you share.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcw />
          {t("metadataEdit.chooseAnother")}
        </Button>
      </div>

      <div className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
        <section className="min-w-0">
          <div className="mb-3 flex items-center gap-3">
            <h2 className="text-sm font-medium">Embedded details</h2>
            <span className="h-px flex-1 bg-border" />
          </div>
          {isLoading ? (
            <div className="flex min-h-72 items-center justify-center gap-2 rounded-2xl border border-border/80 bg-card text-sm text-muted-foreground shadow-sm">
              <Loader2 className="size-4 animate-spin" />
              {t("metadataEdit.reading")}
            </div>
          ) : (
            <div className="grid gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:grid-cols-2">
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
              <div className="sm:col-span-2">
                <Field
                  label={t("metadataEdit.fields.description")}
                  value={fields.description ?? ""}
                  onChange={(value) =>
                    setFields((prev) => ({ ...prev, description: value }))
                  }
                />
              </div>
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
          )}
        </section>

        <aside className="flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm lg:sticky lg:top-6">
          <div className="border-b border-border/80 bg-secondary/45 p-5">
            <p className="font-mono text-[10px] font-medium tracking-[0.14em] text-primary uppercase">
              Selected file
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-sm">
                <FileIcon className="size-4" />
              </div>
              <p className="min-w-0 truncate text-sm font-medium">
                {file.name}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5 p-5">
            <div className="flex flex-col gap-2">
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
            <p className="rounded-lg bg-secondary/65 p-3 text-xs leading-relaxed text-muted-foreground">
              A new copy is saved to your chosen folder. The original file is
              never changed.
            </p>
            {error && (
              <p className="rounded-lg bg-destructive/10 p-3 text-xs leading-relaxed text-destructive">
                {error}
              </p>
            )}
            {saved && (
              <p className="flex items-start gap-2 rounded-lg bg-success/10 p-3 text-xs leading-relaxed text-success">
                <CircleCheck className="mt-0.5 size-4 shrink-0" />
                {t("metadataEdit.saved", { fileName: saved.fileName })}
              </p>
            )}
          </div>

          <div className="border-t border-border/80 p-4">
            <Button
              className="w-full"
              size="lg"
              onClick={handleSave}
              disabled={isSaving || isLoading}
            >
              {isSaving && <Loader2 className="animate-spin" />}
              {t("metadataEdit.save")}
            </Button>
          </div>
        </aside>
      </div>
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
