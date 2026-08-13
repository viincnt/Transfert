import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UploadCloud } from "lucide-react";

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
    <div className="flex flex-col items-center gap-3">
      <div
        className={cn(
          "flex aspect-square w-full max-w-md flex-col items-center justify-center gap-6 rounded-xl border-2 border-dashed p-8 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/20",
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
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {formats.map((format) => (
            <Badge key={format} variant="secondary">
              {format}
            </Badge>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3">
          <UploadCloud className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t("dropzone.cta")}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-px w-8 bg-border" />
            {t("dropzone.or")}
            <span className="h-px w-8 bg-border" />
          </div>
          <Button onClick={open}>{t("dropzone.browse")}</Button>
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
