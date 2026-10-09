import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, UploadCloud } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFilePicker } from "@/hooks/use-file-picker";
import { cn } from "@/lib/utils";

type DropzoneProps = {
  title: string;
  description: string;
  formats: string[];
  accept?: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  className?: string;
};

export function Dropzone({
  title,
  description,
  formats,
  accept,
  multiple = true,
  onFilesSelected,
  className,
}: DropzoneProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [rejected, setRejected] = useState<File[]>([]);
  const { open, handleDrop, inputProps } = useFilePicker({
    accept,
    multiple,
    onFilesSelected: (files) => {
      setRejected([]);
      onFilesSelected(files);
    },
    onFilesRejected: setRejected,
  });

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-3">
      <div
        className={cn(
          "relative flex aspect-[1.45/1] w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-border bg-card/65",
          className,
        )}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          setIsDragging(false);
          handleDrop(event);
        }}
      >
        <div
          aria-hidden
          className="absolute -top-14 -right-14 size-52 rounded-full border border-primary/10"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -left-20 size-56 rounded-full border border-primary/10"
        />
        <div className="relative flex size-13 items-center justify-center rounded-2xl bg-secondary text-primary shadow-sm">
          <UploadCloud className="size-6" strokeWidth={1.5} />
        </div>
        <div className="relative flex flex-col items-center gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            {title}
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="relative flex flex-wrap items-center justify-center gap-1.5">
          {formats.map((format) => (
            <Badge key={format} variant="secondary">
              {format}
            </Badge>
          ))}
        </div>

        <div className="relative flex flex-col items-center gap-3">
          <p className="text-sm font-medium text-muted-foreground">
            {t("dropzone.cta")}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-px w-8 bg-border" />
            {t("dropzone.or")}
            <span className="h-px w-8 bg-border" />
          </div>
          <Button onClick={open} className="px-4">
            {t("dropzone.browse")} <ArrowUpRight />
          </Button>
          <input {...inputProps} />
        </div>
      </div>

      {rejected.length > 0 && (
        <p className="max-w-md text-center text-xs text-destructive">
          {t("dropzone.unsupported", {
            count: rejected.length,
            name: rejected[0]?.name,
          })}
        </p>
      )}
    </div>
  );
}
