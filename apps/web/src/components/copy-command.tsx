"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, AlertCircle } from "lucide-react";

export function CopyCommand({ command }: { command: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function handleCopy() {
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(command);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    timer.current = setTimeout(() => setStatus("idle"), 3000);
  }

  return (
    <div className="command-block">
      <div className="command-line">
        <span aria-hidden="true" className="command-prompt">
          $
        </span>
        <code>{command}</code>
        <button
          type="button"
          onClick={handleCopy}
          className="copy-button"
          aria-label={
            status === "copied" ? "Command copied" : "Copy installation command"
          }
          title="Copy command"
          data-status={status}
        >
          {status === "copied" ? (
            <Check size={17} />
          ) : status === "error" ? (
            <AlertCircle size={17} />
          ) : (
            <Copy size={17} />
          )}
        </button>
      </div>
      <p className="command-feedback" role="status" aria-live="polite">
        {status === "copied"
          ? "Copied. Paste into your terminal to install."
          : status === "error"
            ? "Could not copy. Select the command and copy it manually."
            : "Copy the command, then paste into your terminal."}
      </p>
    </div>
  );
}
