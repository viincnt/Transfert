import { useState } from "react";
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
import { useFilePicker } from "@/hooks/use-file-picker";
import { formatBytes } from "@/lib/format-bytes";
import { resolveFileNameOverride, type NamingMode } from "@/lib/naming";

export type QueueItem = { id: string; file: File };

export type DeliveredFile = {
  fileName: string;
  path: string;
  size: number;
  sha256: string;
};

type ItemStatus =
  | { state: "converting" }
  | { state: "done"; note: string }
  | { state: "error"; message: string };

type MetadataStripQueueProps = {
  items: QueueItem[];
  accept?: string;
  onAddFiles: (files: File[]) => void;
  onRemoveItem: (id: string) => void;
  onClear: () => void;
  onStripItem: (
    item: QueueItem,
    destinationDir: string,
    nameOverride?: string,
  ) => Promise<DeliveredFile>;
};

function extensionOf(fileName: string): string {
  return fileName.split(".").pop() ?? "";
}

export function MetadataStripQueue({
  items,
  accept,
  onAddFiles,
  onRemoveItem,
  onClear,
  onStripItem,
}: MetadataStripQueueProps) {
  const { t } = useTranslation();
  const [destinationDir, setDestinationDir] = useState<string | null>(null);
  const [namingMode, setNamingMode] = useState<NamingMode>("keep");
  const [namingPattern, setNamingPattern] = useState("");
  const [rejected, setRejected] = useState<File[]>([]);
  const [statuses, setStatuses] = useState<Record<string, ItemStatus>>({});
  const [isRunning, setIsRunning] = useState(false);

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

  async function handleStrip() {
    let dir = destinationDir;
    if (!dir) {
      const selected = await pickDestination();
      if (typeof selected !== "string") return;
      dir = selected;
    }
    const dirPath = dir;

    setIsRunning(true);
    await Promise.all(
      items.map(async (item, index) => {
        setStatuses((prev) => ({
          ...prev,
          [item.id]: { state: "converting" },
        }));
        try {
          const nameOverride = resolveFileNameOverride(
            namingMode,
            namingPattern,
            item.file.name,
            extensionOf(item.file.name),
            index + 1,
          );
          const result = await onStripItem(item, dirPath, nameOverride);
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
    setIsRunning(false);
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
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          {t("metadataStrip.notice")}
        </p>

        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <StripRow
              key={item.id}
              item={item}
              status={statuses[item.id]}
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
            onClick={handleStrip}
            disabled={isRunning}
          >
            {isRunning && <Loader2 className="animate-spin" />}
            {t("metadataStrip.strip", { count: items.length })}
          </Button>
        </div>
      </div>
    </div>
  );
}

function StripRow({
  item,
  status,
  onRemove,
}: {
  item: QueueItem;
  status: ItemStatus | undefined;
  onRemove: () => void;
}) {
  const isBusy = status?.state === "converting";

  return (
    <div className="flex items-center gap-3 rounded-lg border p-2.5">
      <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
        <FileIcon className="size-4 text-muted-foreground" />
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
