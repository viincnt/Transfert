import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Apple,
  ArrowRight,
  Check,
  Download,
  MonitorDown,
  Terminal,
} from "lucide-react";

import { CopyCommand } from "@/components/copy-command";
import { getLatestRelease } from "@/lib/releases";
import { siteUrl } from "@/lib/shared";

export const metadata: Metadata = {
  title: "Download Transfert",
  description: "Download the latest version of Transfert for Windows or macOS.",
};

const WINDOWS_COMMAND = `irm ${new URL("/install.ps1", siteUrl).href} | iex`;
const MACOS_COMMAND = `curl -fsSL ${new URL("/install.sh", siteUrl).href} | bash`;

export default async function DownloadPage() {
  const release = await getLatestRelease();

  return (
    <main className="relative overflow-hidden bg-[#f4f3f1] text-[#18191d]">
      <div
        aria-hidden
        className="site-grain pointer-events-none fixed inset-0 z-20"
      />

      <section className="relative mx-auto max-w-[1400px] px-5 pt-10 pb-16 sm:px-8 sm:pt-14 lg:min-h-[calc(100dvh-4rem)] lg:pb-20">
        <div
          aria-hidden
          className="absolute top-12 right-[-13rem] size-[34rem] rounded-full border border-[#18191d]/10 sm:right-[-7rem]"
        />
        <Link
          href="/"
          className="relative inline-flex items-center gap-2 text-sm font-medium text-[#62636a] transition-colors hover:text-[#18191d]"
        >
          <ArrowRight className="size-4 rotate-180" /> Back to Transfert
        </Link>

        <div className="relative mt-12 grid gap-12 lg:grid-cols-[minmax(0,0.86fr)_minmax(22rem,0.74fr)] lg:items-center lg:gap-20">
          <header className="max-w-2xl">
            <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-[#f06c53] uppercase">
              Direct from the source
            </p>
            <h1 className="mt-5 text-5xl leading-[0.89] font-semibold tracking-[-0.065em] text-balance sm:text-7xl">
              Your next download should not need a store.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#62636a] sm:text-xl">
              Pick your platform. Transfert is local, open source, and ships
              straight from its GitHub Release.
            </p>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#62636a]">
              {["No account", "No package manager", "No telemetry"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-2">
                    <Check
                      className="size-3.5 text-[#f06c53]"
                      strokeWidth={2.4}
                    />
                    {item}
                  </span>
                ),
              )}
            </div>
          </header>

          <div className="relative mx-auto w-full max-w-[32rem] lg:max-w-none">
            <div className="relative rotate-[2.5deg] overflow-hidden rounded-[1.4rem] border border-[#18191d]/15 bg-[#18191d] p-2 shadow-[16px_18px_0_#dddcd9] transition-transform duration-500 hover:rotate-0 sm:p-3">
              <Image
                src="/Transfert-001.png"
                alt="The Transfert desktop app"
                width={1102}
                height={701}
                className="h-auto w-full rounded-[0.9rem]"
                priority
              />
            </div>
            <div className="absolute -bottom-5 -left-3 rounded-xl border border-[#18191d]/15 bg-[#fbfaf8] px-4 py-3 shadow-[6px_7px_0_#f06c53] sm:-left-8">
              <p className="font-mono text-[10px] font-medium tracking-[0.14em] text-[#62636a] uppercase">
                Latest release
              </p>
              <p className="mt-1 text-sm font-medium">
                {release ? release.name : "Ready when you are"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-y border-[#18191d]/15 bg-[#ecebea] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-[#f06c53] uppercase">
                Choose a platform
              </p>
              <h2 className="mt-4 text-4xl leading-[0.94] font-semibold tracking-[-0.055em] sm:text-5xl">
                Two installers. Same quiet workflow.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[#62636a]">
              The download buttons always point to the latest published release.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            <article className="flex min-h-[31rem] flex-col overflow-hidden rounded-[1.5rem] bg-[#18191d] p-6 text-[#fbfaf8] shadow-[10px_12px_0_#d6d4d1] sm:p-8 lg:col-span-7">
              <div className="flex items-start justify-between gap-6">
                <span className="flex size-12 items-center justify-center rounded-xl bg-[#fbfaf8]/10 text-[#f06c53]">
                  <MonitorDown className="size-5" />
                </span>
                <span className="font-mono text-[10px] font-medium tracking-[0.14em] text-[#fbfaf8]/45 uppercase">
                  MSI / PowerShell
                </span>
              </div>
              <h3 className="mt-10 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
                Windows
              </h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-[#fbfaf8]/60">
                Download the installer, or let PowerShell fetch and run the
                latest MSI for you.
              </p>
              <div className="mt-7 min-h-10">
                {release?.windows ? (
                  <a
                    href={release.windows.browser_download_url}
                    className="inline-flex items-center gap-2 rounded-full bg-[#f06c53] px-5 py-3 text-sm font-medium text-[#18191d] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    <Download className="size-4" /> Download MSI
                  </a>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-[#fbfaf8]/20 px-4 py-2.5 text-sm text-[#fbfaf8]/60">
                    Installer publishing soon
                  </span>
                )}
              </div>
              <div className="mt-auto pt-10">
                <p className="mb-2 flex items-center gap-2 font-mono text-[10px] font-medium tracking-[0.14em] text-[#fbfaf8]/45 uppercase">
                  <Terminal className="size-3.5" /> Run in PowerShell
                </p>
                <CopyCommand command={WINDOWS_COMMAND} />
              </div>
            </article>

            <article className="flex min-h-[31rem] flex-col overflow-hidden rounded-[1.5rem] border border-[#18191d]/15 bg-[#fbfaf8] p-6 shadow-[10px_12px_0_#d6d4d1] sm:p-8 lg:col-span-5">
              <div className="flex items-start justify-between gap-6">
                <span className="flex size-12 items-center justify-center rounded-xl bg-[#f06c53] text-[#fbfaf8]">
                  <Apple className="size-5" />
                </span>
                <span className="font-mono text-[10px] font-medium tracking-[0.14em] text-[#62636a] uppercase">
                  DMG / Terminal
                </span>
              </div>
              <h3 className="mt-10 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
                macOS
              </h3>
              <p className="mt-3 max-w-sm text-base leading-relaxed text-[#62636a]">
                Download the DMG, or install the latest release from Terminal.
              </p>
              <div className="mt-7 min-h-10">
                {release?.macos ? (
                  <a
                    href={release.macos.browser_download_url}
                    className="inline-flex items-center gap-2 rounded-full border border-[#18191d]/20 px-5 py-3 text-sm font-medium transition-colors hover:border-[#18191d] hover:bg-[#ecebea]"
                  >
                    <Download className="size-4" /> Download DMG
                  </a>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-[#18191d]/15 px-4 py-2.5 text-sm text-[#62636a]">
                    Installer publishing soon
                  </span>
                )}
              </div>
              <div className="mt-auto pt-10">
                <p className="mb-2 flex items-center gap-2 font-mono text-[10px] font-medium tracking-[0.14em] text-[#62636a] uppercase">
                  <Terminal className="size-3.5" /> Run in Terminal
                </p>
                <CopyCommand command={MACOS_COMMAND} />
                <p className="mt-4 text-xs leading-relaxed text-[#62636a]">
                  The installer copies Transfert to Applications and removes the
                  quarantine attribute.
                </p>
              </div>
            </article>
          </div>

          <p className="mt-7 text-sm leading-relaxed text-[#62636a]">
            {release
              ? `Currently serving ${release.name}.`
              : "No release is published yet. The commands will work as soon as the first release is live."}
          </p>
        </div>
      </section>
    </main>
  );
}
