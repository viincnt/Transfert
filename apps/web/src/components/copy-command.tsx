"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — silently ignore,
      // the command is still selectable/copyable by hand.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group flex w-full max-w-lg items-center justify-between gap-3 rounded-xl border border-[#18191d]/15 bg-[#fbfaf8] px-4 py-3 text-left font-mono text-xs text-[#62636a] transition-colors hover:border-[#f06c53] hover:text-[#18191d] sm:text-sm"
    >
      <span className="flex items-center gap-2 overflow-x-auto">
        <span className="text-[#f06c53] select-none">$</span>
        {command}
      </span>
      <span className="shrink-0 text-[#62636a]/70 transition-colors group-hover:text-[#18191d]">
        {copied ? (
          <Check className="size-3.5" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </span>
    </button>
  );
}
