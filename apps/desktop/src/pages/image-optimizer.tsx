import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";

import {
  ConversionQueue,
  type ConversionOutcome,
  type QueueItem,
  type ZipBatchEntry,
  type ZipBatchOutcome,
} from "@/components/conversion-queue";
import { Dropzone } from "@/components/dropzone";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OUTPUT_FORMATS = ["WEBP", "JPG", "AVIF"];
const INPUT_FORMATS = ["JPG", "PNG", "WEBP", "GIF", "BMP", "TIFF", "AVIF"];

const resizePresets = [
  { value: "0", label: "Keep original dimensions" },
  { value: "2560", label: "2560 px maximum edge" },
  { value: "1920", label: "1920 px maximum edge" },
  { value: "1440", label: "1440 px maximum edge" },
  { value: "1080", label: "1080 px maximum edge" },
  { value: "720", label: "720 px maximum edge" },
];

function toQueueItems(files: File[]): QueueItem[] {
  return files.map((file) => ({ id: crypto.randomUUID(), file }));
}

export function ImageOptimizer() {
  const { t } = useTranslation();
  const [items, setItems] = useState<QueueItem[]>([]);
  const [maxDimension, setMaxDimension] = useState("0");

  function addFiles(files: File[]) {
    setItems((previous) => [...previous, ...toQueueItems(files)]);
  }

  const requestedMaxDimension = Number(maxDimension) || undefined;

  async function optimizeImage(
    item: QueueItem,
    format: string,
    destinationDir: string,
    nameOverride?: string,
  ): Promise<ConversionOutcome> {
    const bytes = new Uint8Array(await item.file.arrayBuffer());
    return invoke<ConversionOutcome>("convert_image_command", {
      bytes,
      fileName: item.file.name,
      targetFormat: format,
      destinationDir,
      nameOverride,
      maxDimension: requestedMaxDimension,
    });
  }

  async function optimizeImagesToZip(
    entries: ZipBatchEntry[],
    destinationDir: string,
    _zipName: string,
  ): Promise<ZipBatchOutcome> {
    const files = await Promise.all(
      entries.map(async ({ item, format, nameOverride }) => ({
        id: item.id,
        bytes: new Uint8Array(await item.file.arrayBuffer()),
        fileName: item.file.name,
        targetFormat: format,
        nameOverride,
        maxDimension: requestedMaxDimension,
      })),
    );
    return invoke<ZipBatchOutcome>("convert_images_to_zip_command", {
      files,
      destinationDir,
      zipName: "optimized",
    });
  }

  if (items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Dropzone
          title={t("imageOptimizer.dropzone.title")}
          description={t("imageOptimizer.dropzone.description")}
          formats={INPUT_FORMATS}
          accept="image/*"
          onFilesSelected={addFiles}
        />
      </div>
    );
  }

  return (
    <ConversionQueue
      items={items}
      formats={OUTPUT_FORMATS}
      accept="image/*"
      outputControls={
        <div className="flex flex-col gap-2">
          <Label>{t("imageOptimizer.maxDimension.label")}</Label>
          <Select value={maxDimension} onValueChange={setMaxDimension}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {resizePresets.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t("imageOptimizer.maxDimension.hint")}
          </p>
        </div>
      }
      onAddFiles={addFiles}
      onRemoveItem={(id) =>
        setItems((previous) => previous.filter((item) => item.id !== id))
      }
      onClear={() => setItems([])}
      onConvertItem={optimizeImage}
      onConvertBatchToZip={optimizeImagesToZip}
    />
  );
}
