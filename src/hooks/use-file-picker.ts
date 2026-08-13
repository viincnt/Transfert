import {
  useCallback,
  useMemo,
  useRef,
  type ChangeEvent,
  type DragEvent,
} from "react";

import { filterFilesByAccept, parseAcceptPatterns } from "@/lib/file-accept";

type UseFilePickerOptions = {
  accept?: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  onFilesRejected?: (files: File[]) => void;
};

/**
 * Central "get files in" plumbing, shared by every place that lets the user
 * add files (Dropzone, "add more" buttons, ...): a hidden <input> + `open()`
 * to trigger it, and a `handleDrop` for drag-and-drop — both funnel through
 * the same `processFiles`, so accept-filtering only lives in one place.
 *
 * `accept` is parsed into matcher patterns once per `accept` value (useMemo)
 * instead of on every dropped/selected file.
 */
export function useFilePicker({
  accept,
  multiple = true,
  onFilesSelected,
  onFilesRejected,
}: UseFilePickerOptions) {
  const inputRef = useRef<HTMLInputElement>(null);
  const patterns = useMemo(() => parseAcceptPatterns(accept), [accept]);

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const list = Array.from(files);
      if (list.length === 0) return;

      const { accepted, rejected } = filterFilesByAccept(list, patterns);
      if (accepted.length > 0) onFilesSelected(accepted);
      if (rejected.length > 0) onFilesRejected?.(rejected);
    },
    [patterns, onFilesSelected, onFilesRejected],
  );

  const open = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      processFiles(event.target.files ?? []);
      // Reset so picking the same file again still fires a change event.
      event.target.value = "";
    },
    [processFiles],
  );

  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      processFiles(event.dataTransfer.files);
    },
    [processFiles],
  );

  return {
    open,
    handleDrop,
    inputProps: {
      ref: inputRef,
      type: "file" as const,
      accept,
      multiple,
      className: "hidden",
      onChange: handleChange,
    },
  };
}
