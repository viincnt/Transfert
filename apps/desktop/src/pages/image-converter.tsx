import { useState } from "react";
import { useTranslation } from "react-i18next";
import { invoke } from "@tauri-apps/api/core";

import {
  ConversionQueue,
  type ConversionOutcome,
  type QueueItem,
  type ZipBatchEntry,
  type ZipBatchOutcome,
} from "@/components/conversion-queue";
import { Dropzone } from "@/components/dropzone";

// Formats Transfert can produce. "SVG" here wraps the raster image in an
// SVG document (base64 PNG data URI) rather than tracing it into real
// vector paths — the same thing most "convert to SVG" tools do for
// photographic sources.
const OUTPUT_FORMATS = [
  "PNG",
  "JPG",
  "WEBP",
  "GIF",
  "BMP",
  "TIFF",
  "AVIF",
  "ICO",
  "SVG",
];

// What the dropzone accepts and advertises. Same list as the outputs —
// SVG works both ways (rasterized on the way in, wrapped on the way out).
const INPUT_FORMATS = OUTPUT_FORMATS;

function toQueueItems(files: File[]): QueueItem[] {
  return files.map((file) => ({ id: crypto.randomUUID(), file }));
}

async function convertImage(
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
  });
}

async function convertImagesToZip(
  entries: ZipBatchEntry[],
  destinationDir: string,
  zipName: string,
): Promise<ZipBatchOutcome> {
  const files = await Promise.all(
    entries.map(async ({ item, format, nameOverride }) => ({
      id: item.id,
      bytes: new Uint8Array(await item.file.arrayBuffer()),
      fileName: item.file.name,
      targetFormat: format,
      nameOverride,
    })),
  );
  return invoke<ZipBatchOutcome>("convert_images_to_zip_command", {
    files,
    destinationDir,
    zipName,
  });
}

export function ImageConverter() {
  const { t } = useTranslation();
  const [items, setItems] = useState<QueueItem[]>([]);

  function addFiles(files: File[]) {
    setItems((prev) => [...prev, ...toQueueItems(files)]);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  if (items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Dropzone
          title={t("imageConverter.dropzone.title")}
          description={t("imageConverter.dropzone.description")}
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
      formatNotices={{ SVG: t("imageConverter.svgNotice") }}
      onAddFiles={addFiles}
      onRemoveItem={removeItem}
      onClear={() => setItems([])}
      onConvertItem={convertImage}
      onConvertBatchToZip={convertImagesToZip}
    />
  );
}
