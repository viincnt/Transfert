import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import LegalLayout from "../components/legal-layout";
import BrandIcon from "../components/brand-icon";
import CopyButton from "./copy-button";

const icon = { strokeWidth: 1.5, "aria-hidden": true } as const;

const BASE = "https://usetransfert.vercel.app";

type Status = "available" | "in-development" | "planned";

const platforms: {
  name: string;
  ext: string;
  cli: string;
  url: string;
  status: Status;
}[] = [
  {
    name: "macOS",
    ext: ".dmg",
    cli: `curl -fsSL ${BASE}/install.sh | sh`,
    url: `${BASE}/releases/latest/transfert.dmg`,
    status: "in-development",
  },
  {
    name: "Windows",
    ext: ".msi",
    cli: `irm ${BASE}/install.ps1 | iex`,
    url: `${BASE}/releases/latest/transfert.msi`,
    status: "planned",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("downloadPage");
  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

function PlatformCard({
  name,
  ext,
  cli,
  url,
  status,
}: (typeof platforms)[number]) {
  const t = useTranslations("downloadPage");
  const available = status === "available";
  const label =
    status === "in-development" ? t("statusInDevelopment") : t("statusPlanned");

  return (
    <div
      className={`bg-surface overflow-clip rounded-[16px] transition-opacity duration-200 ${
        status === "planned" ? "opacity-50" : ""
      }`}
    >
      {/* card header */}
      <div className="flex items-center justify-between gap-4 px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="text-[1.0625rem] font-medium tracking-[-0.01em]">
            {name}
          </span>
          <span className="text-muted text-ui font-mono">{ext}</span>
        </div>
        <span className="text-ui text-muted bg-raised rounded-full px-2.5 py-0.5">
          {label}
        </span>
      </div>

      {/* divider */}
      <div className="border-line border-t" />

      {/* binary row */}
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <div className="grid gap-0.5">
          <span className="text-muted text-ui">{t("directDownload")}</span>
          <span className="text-ui font-mono">
            transfert{ext}
          </span>
        </div>
        <a
          href={available ? url : undefined}
          aria-disabled={!available}
          className={`inline-flex h-9 items-center gap-2 rounded-[8px] px-4 text-[0.875rem] font-medium transition-colors duration-150 ${
            available
              ? "bg-ink text-bg hover:bg-accent"
              : "bg-raised text-muted pointer-events-none"
          }`}
        >
          <Download {...icon} size={13} />
          {t("downloadButton")}
        </a>
      </div>

      {/* divider */}
      <div className="border-line mx-6 border-t" />

      {/* cli row */}
      <div className="px-6 py-4">
        <span className="text-muted text-ui mb-2 block">{t("commandLine")}</span>
        <div className="bg-raised flex items-center gap-3 rounded-[8px] px-4 py-3">
          <code className="text-ui min-w-0 flex-1 truncate font-mono leading-none">
            <span className="text-muted select-none">$ </span>
            {cli}
          </code>
          <CopyButton text={cli} />
        </div>
      </div>
    </div>
  );
}

export default function DownloadPage() {
  const t = useTranslations("downloadPage");
  return (
    <LegalLayout title="" updated="">
      {/* hero */}
      <div className="mb-12 flex flex-col items-start gap-6">
        <div className="flex items-center gap-4">
          <BrandIcon size={48} className="rounded-[22%]" />
          <div>
            <h1 className="text-[1.75rem] leading-none font-medium tracking-[-0.03em]">
              {t("appName")}
            </h1>
            <p className="text-muted text-ui mt-1">{t("appSubtitle")}</p>
          </div>
        </div>

        <div className="bg-surface inline-flex items-center gap-2.5 rounded-full px-4 py-2">
          <span className="bg-accent/40 relative inline-flex size-2 shrink-0 rounded-full">
            <span className="bg-accent absolute inline-flex size-full animate-ping rounded-full opacity-60" />
            <span className="bg-accent relative inline-flex size-2 rounded-full" />
          </span>
          <span className="text-muted text-ui">{t("statusBadge")}</span>
        </div>

        <p className="text-muted max-w-[48ch] leading-[1.7]">
          {t("description")}
        </p>
      </div>

      {/* platform cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {platforms.map((p) => (
          <PlatformCard key={p.name} {...p} />
        ))}
      </div>

      {/* footnote */}
      <p className="text-muted text-ui mt-6 max-w-[48ch] leading-[1.6]">
        {t("footnote")}
      </p>

      {/* actions */}
      <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-[var(--color-line)] pt-8">
        <Link href="/#demo" className="group button-primary">
          {t("tryDemo")}
          <ArrowRight {...icon} size={16} className="arrow" />
        </Link>
        <a
          href="https://github.com/viincnt/Transfert"
          target="_blank"
          rel="noreferrer"
          className="text-muted hover:text-ink inline-flex h-11 items-center gap-1.5 transition-colors duration-200"
        >
          {t("followGithub")}
          <ArrowUpRight {...icon} size={14} />
        </a>
      </div>
    </LegalLayout>
  );
}
