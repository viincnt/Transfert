import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import {
  ConversionQueue,
  type ConversionOutcome,
  type QueueItem,
  type ZipBatchOutcome,
} from "@/components/conversion-queue";
import { Dropzone } from "@/components/dropzone";
import { Button } from "@/components/ui/button";
import { conversionInputs } from "@/lib/conversion-formats";

export type ConverterKind = "document" | "audio" | "video";

const converters = {
  document: {
    title: "Document Converter",
    inputs: ["TXT", "MD", "MARKDOWN", "HTML", "HTM"],
    outputs: ["TXT", "MD", "HTML"],
    description:
      "Convert UTF-8 text, Markdown and HTML locally. Text conversions do not preserve page layout or embedded media.",
  },
  audio: {
    title: "Audio Converter",
    inputs: [
      "MP3",
      "WAV",
      "WAVE",
      "FLAC",
      "OGG",
      "OPUS",
      "M4A",
      "AAC",
      "AIFF",
      "AIF",
      "WMA",
      "AC3",
      "APE",
      "MKA",
      "MP4",
      "MKV",
      "WEBM",
    ],
    outputs: ["WAV", "FLAC", "MP3", "OGG", "OPUS", "M4A"],
    description:
      "Experimental LibVLC 3 conversion to MP3, OGG, Opus, FLAC, M4A or WAV. Outputs that fail duration verification are rejected. Codec availability depends on the runtime.",
  },
  video: {
    title: "Video Converter",
    inputs: [
      "MP4",
      "MKV",
      "MOV",
      "AVI",
      "WEBM",
      "OGV",
      "WMV",
      "FLV",
      "MPEG",
      "MPG",
      "M4V",
      "TS",
      "MTS",
      "M2TS",
      "3GP",
      "VOB",
      "Y4M",
    ],
    outputs: ["MP4", "MOV", "WEBM", "OGV", "TS", "AVI"],
    description:
      "Transcode video with LibVLC 3. Outputs use preset codecs; subtitles, chapters and metadata are not preserved.",
  },
};

export function FileConverter({ kind }: { kind: ConverterKind }) {
  const config = converters[kind];
  const inputs = conversionInputs(config.inputs, config.outputs);
  const [items, setItems] = useState<QueueItem[]>([]);
  const [runtime, setRuntime] = useState<"unverified" | "checking" | "ready" | string>(
    kind === "document" ? "ready" : "unverified",
  );
  async function checkRuntime() {
    if (kind === "document") return true;
    setRuntime("checking");
    try {
      await invoke("media_runtime_command");
      setRuntime("ready");
      return true;
    } catch (error) {
      setRuntime(String(error));
      return false;
    }
  }

  if (runtime !== "unverified" && runtime !== "ready") {
    return (
      <div className="mx-auto max-w-2xl space-y-4 p-8">
        <h1 className="text-xl font-semibold">{config.title}</h1>
        <p role="status" className="text-sm text-muted-foreground">
          {runtime === "checking" ? "Checking LibVLC runtime…" : runtime}
        </p>
        {runtime !== "checking" && (
          <Button onClick={checkRuntime}>Check again</Button>
        )}
      </div>
    );
  }

  async function addFiles(files: File[]) {
    // Loading LibVLC can abort the native process on a broken installation, so
    // never initialize it merely by navigating to a media converter.
    if (kind !== "document" && runtime !== "ready" && !(await checkRuntime())) {
      return;
    }
    setItems((prev) => [
      ...prev,
      ...files.map((file) => ({ id: crypto.randomUUID(), file })),
    ]);
  }
  const accept = inputs.accept;
  if (!items.length) {
    return (
      <div className="flex min-h-full items-center justify-center p-6">
        <Dropzone
          title={config.title}
          description={config.description}
          formats={inputs.formats}
          accept={accept}
          onFilesSelected={addFiles}
        />
      </div>
    );
  }
  return (
    <ConversionQueue
      items={items}
      formats={config.outputs}
      accept={accept}
      onAddFiles={addFiles}
      onRemoveItem={(id) =>
        setItems((prev) => prev.filter((item) => item.id !== id))
      }
      onClear={() => setItems([])}
      outputControls={
        <>
          <p className="text-xs text-muted-foreground">{config.description}</p>
          {kind === "audio" && (
            <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-800 dark:text-amber-200">
              Experimental: the current LibVLC runtime can trim the end of some
              files. Keep your original file and check the converted result.
            </p>
          )}
        </>
      }
      onConvertItem={async (item, format, destinationDir, nameOverride) =>
        invoke<ConversionOutcome>("convert_file_command", {
          bytes: new Uint8Array(await item.file.arrayBuffer()),
          fileName: item.file.name,
          targetFormat: format,
          kind,
          destinationDir,
          nameOverride,
        })
      }
      onConvertBatchToZip={async (entries, destinationDir, zipName) =>
        invoke<ZipBatchOutcome>("convert_files_to_zip_command", {
          files: await Promise.all(
            entries.map(async ({ item, format, nameOverride }) => ({
              id: item.id,
              bytes: new Uint8Array(await item.file.arrayBuffer()),
              fileName: item.file.name,
              targetFormat: format,
              nameOverride,
            })),
          ),
          kind,
          destinationDir,
          zipName,
        })
      }
    />
  );
}
