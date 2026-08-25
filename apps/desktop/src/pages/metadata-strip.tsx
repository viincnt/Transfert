import { useState } from "react";
import { useTranslation } from "react-i18next";
import { invoke } from "@tauri-apps/api/core";

import {
  MetadataStripQueue,
  type DeliveredFile,
  type QueueItem,
} from "@/components/metadata-strip-queue";
import { Dropzone } from "@/components/dropzone";

// Formats little_exif can actually clear metadata from — see
// src-tauri/src/metadata/mod.rs. WebP is further limited to
// lossless/extended WebP by little_exif itself.
const INPUT_FORMATS = ["JPG", "PNG", "TIFF", "WEBP"];

function toQueueItems(files: File[]): QueueItem[] {
  return files.map((file) => ({ id: crypto.randomUUID(), file }));
}

async function stripMetadata(
  item: QueueItem,
  destinationDir: string,
  nameOverride?: string,
): Promise<DeliveredFile> {
  const bytes = new Uint8Array(await item.file.arrayBuffer());
  return invoke<DeliveredFile>("strip_metadata_command", {
    bytes,
    fileName: item.file.name,
    destinationDir,
    nameOverride,
  });
}

export function MetadataStrip() {
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
          title={t("metadataStrip.dropzone.title")}
          description={t("metadataStrip.dropzone.description")}
          formats={INPUT_FORMATS}
          accept="image/jpeg,image/png,image/tiff,image/webp"
          onFilesSelected={addFiles}
        />
      </div>
    );
  }

  return (
    <MetadataStripQueue
      items={items}
      accept="image/jpeg,image/png,image/tiff,image/webp"
      onAddFiles={addFiles}
      onRemoveItem={removeItem}
      onClear={() => setItems([])}
      onStripItem={stripMetadata}
    />
  );
}
