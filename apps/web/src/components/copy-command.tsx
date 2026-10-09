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
      className="group flex w-full max-w-lg items-center justify-between gap-3 rounded-xl border border-[#172420]/15 bg-[#fffaf2] px-4 py-3 text-left font-mono text-xs text-[#52605a] transition-colors hover:border-[#f06c53] hover:text-[#172420] sm:text-sm"
    >
      <span className="flex items-center gap-2 overflow-x-auto">
        <span className="text-[#f06c53] select-none">$</span>
        {command}
      </span>
      <span className="shrink-0 text-[#52605a]/70 transition-colors group-hover:text-[#172420]">
        {copied ? (
          <Check className="size-3.5" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </span>
    </button>
  );
}
