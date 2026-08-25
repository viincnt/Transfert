import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { open } from "@tauri-apps/plugin-dialog";
import {
  CircleAlert,
  CircleCheck,
  File as FileIcon,
  Info,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useFilePicker } from "@/hooks/use-file-picker";
import { formatBytes } from "@/lib/format-bytes";
import { resolveFileNameOverride, type NamingMode } from "@/lib/naming";
import { cn } from "@/lib/utils";

export type QueueItem = { id: string; file: File };

export type DeliveredFile = {
  fileName: string;
  path: string;
  size: number;
  sha256: string;
};

export type ConversionOutcome = DeliveredFile & {
  width: number;
  height: number;
};

export type ZipBatchOutcome = {
  zip: DeliveredFile;
  entries: { id: string; fileName?: string; error?: string }[];
};

export type ZipBatchEntry = {
  item: QueueItem;
  format: string;
  nameOverride?: string;
};

type ItemStatus =
  | { state: "converting" }
  | { state: "done"; note: string }
  | { state: "error"; message: string };

type SaveMode = "individual" | "zip";

type ConversionQueueProps = {
  items: QueueItem[];
  formats: string[];
  accept?: string;
  // Per-format heads-up shown when that format is the effective target
  // for at least one item (e.g. "SVG" → "this wraps the image, it
  // doesn't vectorize it"). Keeps format-specific caveats out of this
  // otherwise format-agnostic component.
  formatNotices?: Partial<Record<string, string>>;
  onAddFiles: (files: File[]) => void;
  onRemoveItem: (id: string) => void;
  onClear: () => void;
  onConvertItem: (
    item: QueueItem,
    format: string,
    destinationDir: string,
    nameOverride?: string,
  ) => Promise<ConversionOutcome>;
  onConvertBatchToZip: (
    entries: ZipBatchEntry[],
    destinationDir: string,
    zipName: string,
  ) => Promise<ZipBatchOutcome>;
};

export function ConversionQueue({
  items,
  formats,
  accept,
  formatNotices,
  onAddFiles,
  onRemoveItem,
  onClear,
  onConvertItem,
  onConvertBatchToZip,
}: ConversionQueueProps) {
  const { t } = useTranslation();
  const [globalFormat, setGlobalFormat] = useState(formats[0]);
  const [perFileFormat, setPerFileFormat] = useState<Record<string, string>>(
    {},
  );
  const [destinationDir, setDestinationDir] = useState<string | null>(null);
  const [saveMode, setSaveMode] = useState<SaveMode>("individual");
  const [namingMode, setNamingMode] = useState<NamingMode>("keep");
  const [namingPattern, setNamingPattern] = useState("");
  const [rejected, setRejected] = useState<File[]>([]);
  const [statuses, setStatuses] = useState<Record<string, ItemStatus>>({});
  const [isConverting, setIsConverting] = useState(false);

  const { open: openFilePicker, inputProps } = useFilePicker({
    accept,
    onFilesSelected: (files) => {
      setRejected([]);
      onAddFiles(files);
    },
    onFilesRejected: setRejected,
  });

  async function pickDestination() {
    const selected = await open({ directory: true, multiple: false });
    if (typeof selected === "string") setDestinationDir(selected);
    return selected;
  }

  function nameFor(item: QueueItem, format: string, index: number) {
    return resolveFileNameOverride(
      namingMode,
      namingPattern,
      item.file.name,
      format,
      index,
    );
  }

  async function handleConvert() {
    let dir = destinationDir;
    if (!dir) {
      const selected = await pickDestination();
      if (typeof selected !== "string") return;
      dir = selected;
    }

    setIsConverting(true);

    if (saveMode === "zip") {
      setStatuses(
        Object.fromEntries(
          items.map((item) => [item.id, { state: "converting" } as const]),
        ),
      );
      try {
        const entries: ZipBatchEntry[] = items.map((item, index) => {
          const format = perFileFormat[item.id] ?? globalFormat;
          return {
            item,
            format,
            nameOverride: nameFor(item, format, index + 1),
          };
        });
        const outcome = await onConvertBatchToZip(entries, dir, "converted");
        const byId = new Map(outcome.entries.map((entry) => [entry.id, entry]));

        setStatuses((prev) => {
          const next = { ...prev };
          for (const item of items) {
            const entry = byId.get(item.id);
            if (entry?.error) {
              next[item.id] = { state: "error", message: entry.error };
            } else {
              next[item.id] = {
                state: "done",
                note: t("queue.bundledInto", { zipName: outcome.zip.fileName }),
              };
            }
          }
          return next;
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setStatuses(
          Object.fromEntries(
            items.map((item) => [
              item.id,
              { state: "error", message } as const,
            ]),
          ),
        );
      }
    } else {
      const dirPath = dir;
      await Promise.all(
        items.map(async (item, index) => {
          const format = perFileFormat[item.id] ?? globalFormat;
          setStatuses((prev) => ({
            ...prev,
            [item.id]: { state: "converting" },
          }));
          try {
            const result = await onConvertItem(
              item,
              format,
              dirPath,
              nameFor(item, format, index + 1),
            );
            setStatuses((prev) => ({
              ...prev,
              [item.id]: {
                state: "done",
                note: `${formatBytes(item.file.size)} → ${formatBytes(result.size)}`,
              },
            }));
          } catch (error) {
            setStatuses((prev) => ({
              ...prev,
              [item.id]: {
                state: "error",
                message: error instanceof Error ? error.message : String(error),
              },
            }));
          }
        }),
      );
    }

    setIsConverting(false);
  }

  return (
    <div className="flex h-full flex-col">
      <input {...inputProps} />

      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b bg-background px-6 py-4">
        <p className="text-sm font-medium">
          {t("queue.filesReady", { count: items.length })}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={openFilePicker}>
            <Plus />
            {t("queue.addMore")}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClear}>
            <Trash2 />
            {t("queue.clearAll")}
          </Button>
        </div>
      </div>

      {rejected.length > 0 && (
        <p className="border-b bg-background px-6 py-2 text-center text-xs text-destructive">
          {t("dropzone.unsupported", {
            count: rejected.length,
            name: rejected[0]?.name,
          })}
        </p>
      )}

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-6">
        <div className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3">
          <Label className="shrink-0">{t("queue.convertAllTo")}</Label>
          <Select value={globalFormat} onValueChange={setGlobalFormat}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {formats.map((format) => (
                <SelectItem key={format} value={format}>
                  {format}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {Object.entries(formatNotices ?? {}).map(
          ([format, notice]) =>
            items.some(
              (item) => (perFileFormat[item.id] ?? globalFormat) === format,
            ) && (
              <p
                key={format}
                className="flex items-start gap-1.5 text-xs text-muted-foreground"
              >
                <Info className="mt-0.5 size-3.5 shrink-0" />
                {notice}
              </p>
            ),
        )}

        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <FileRow
              key={item.id}
              item={item}
              formats={formats}
              value={perFileFormat[item.id] ?? globalFormat}
              status={statuses[item.id]}
              onFormatChange={(format) =>
                setPerFileFormat((prev) => ({ ...prev, [item.id]: format }))
              }
              onRemove={() => onRemoveItem(item.id)}
            />
          ))}
        </div>

        <div className="flex flex-col divide-y rounded-lg border">
          <div className="flex flex-col gap-3 p-4">
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

          <div className="flex flex-wrap items-center justify-between gap-4 p-4">
            <Label>{t("queue.saveMode.label")}</Label>
            <ToggleGroup
              type="single"
              variant="outline"
              value={saveMode}
              onValueChange={(value) => {
                if (value) setSaveMode(value as SaveMode);
              }}
            >
              <ToggleGroupItem value="individual" className="px-3 text-xs">
                {t("queue.saveMode.individual")}
              </ToggleGroupItem>
              <ToggleGroupItem value="zip" className="px-3 text-xs">
                {t("queue.saveMode.zip")}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="flex flex-col gap-3 p-4">
            <Label>{t("queue.naming.label")}</Label>
            <Select
              value={namingMode}
              onValueChange={(value) => setNamingMode(value as NamingMode)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="keep">{t("queue.naming.keep")}</SelectItem>
                <SelectItem value="suffix">
                  {t("queue.naming.suffix")}
                </SelectItem>
                <SelectItem value="custom">
                  {t("queue.naming.custom")}
                </SelectItem>
              </SelectContent>
            </Select>
            {namingMode === "custom" && (
              <div className="flex flex-col gap-1.5">
                <Input
                  value={namingPattern}
                  onChange={(event) => setNamingPattern(event.target.value)}
                  placeholder={t("queue.naming.customPlaceholder")}
                />
                <p className="text-xs text-muted-foreground">
                  {t("queue.naming.customHint")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 border-t bg-background px-6 py-4">
        <div className="mx-auto flex w-full max-w-2xl">
          <Button
            className="w-full"
            size="lg"
            onClick={handleConvert}
            disabled={isConverting}
          >
            {isConverting && <Loader2 className="animate-spin" />}
            {t("queue.convert", { count: items.length })}
          </Button>
        </div>
      </div>
    </div>
  );
}

function FileRow({
  item,
  formats,
  value,
  status,
  onFormatChange,
  onRemove,
}: {
  item: QueueItem;
  formats: string[];
  value: string;
  status: ItemStatus | undefined;
  onFormatChange: (format: string) => void;
  onRemove: () => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const isBusy = status?.state === "converting";

  useEffect(() => {
    if (!item.file.type.startsWith("image/")) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(item.file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [item.file]);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border p-2.5",
        status?.state === "error" && "border-destructive/40",
      )}
    >
      <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
        {previewUrl ? (
          <img src={previewUrl} alt="" className="size-full object-cover" />
        ) : (
          <FileIcon className="size-4 text-muted-foreground" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{item.file.name}</p>
        {status?.state === "done" ? (
          <p className="truncate text-xs text-muted-foreground">
            {status.note}
          </p>
        ) : status?.state === "error" ? (
          <p className="truncate text-xs text-destructive">{status.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            {formatBytes(item.file.size)}
          </p>
        )}
      </div>

      <Select value={value} onValueChange={onFormatChange} disabled={isBusy}>
        <SelectTrigger className="w-28 shrink-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {formats.map((format) => (
            <SelectItem key={format} value={format}>
              {format}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {status?.state === "converting" && (
        <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
      )}
      {status?.state === "done" && (
        <CircleCheck className="size-4 shrink-0 text-emerald-500" />
      )}
      {status?.state === "error" && (
        <CircleAlert className="size-4 shrink-0 text-destructive" />
      )}

      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={onRemove}
        disabled={isBusy}
      >
        <X />
      </Button>
    </div>
  );
}
