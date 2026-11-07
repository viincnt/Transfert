"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";

const icon = { strokeWidth: 1.5, "aria-hidden": true } as const;

export default function CopyButton({ text }: { text: string }) {
  const t = useTranslations("downloadPage");
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={t("copyCommand")}
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        });
      }}
      className="text-muted hover:text-ink shrink-0 transition-colors duration-150"
    >
      {copied ? <Check {...icon} size={13} /> : <Copy {...icon} size={13} />}
    </button>
  );
}
