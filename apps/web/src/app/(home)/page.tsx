import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Download,
  ShieldCheck,
  WifiOff,
} from "lucide-react";
import { CopyCommand } from "@/components/copy-command";
import { Reveal } from "@/components/reveal";
import { Flare } from "@/components/flare";

const STORE_URL = "https://apps.microsoft.com/detail/9PG711NS9JVS";
const WINGET_COMMAND = "winget install --id 9PG711NS9JVS --source msstore";

const pitches = [
  {
    icon: WifiOff,
    title: "Local-first",
    body: "Every conversion, compression and cleanup runs entirely on your machine. No upload, no server round-trip, no account.",
  },
  {
    icon: ShieldCheck,
    title: "Verified writes",
    body: "Encodes get re-decoded and compared, writes get re-read and re-hashed — a corrupted result is caught and discarded, never silently saved.",
  },
  {
    icon: CheckCircle2,
    title: "No telemetry",
    body: "Nothing about your files or your usage leaves the app. If your computer can already do the job, Transfert just gives it a decent interface.",
  },
];

const toolGroups = [
  {
    category: "File Converter",
    tools: [
      { name: "Image", available: true },
      { name: "Document", available: false },
      { name: "Audio", available: false },
      { name: "Video", available: false },
    ],
  },
  {
    category: "PDF Tools",
    tools: [
      { name: "Merge & Split", available: false },
      { name: "Compress", available: false },
      { name: "Edit & Annotate", available: false },
    ],
  },
  {
    category: "OCR",
    tools: [
      { name: "Image → Text", available: false },
      { name: "PDF → Text", available: false },
    ],
  },
  {
    category: "Metadata",
    tools: [
      { name: "Strip", available: true },
      { name: "Edit", available: true },
    ],
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-fd-border/60">
        <div aria-hidden className="absolute inset-0">
          <div className="glow-backdrop line-grid absolute inset-0" />
          <Flare className="-top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 bg-white/10" />
          <Flare className="top-16 -right-24 h-64 w-64 bg-white/[0.06]" />
        </div>
        <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 pt-24 pb-20 text-center sm:pt-32 sm:pb-28">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card/60 px-3 py-1 text-xs font-medium text-fd-muted-foreground backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-fd-primary" />
              Early development · Windows today
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="text-balance text-4xl font-semibold sm:text-6xl">
              Your computer can already
              <br className="hidden sm:block" /> do most of this. So let it.
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="max-w-xl text-pretty text-base text-fd-muted-foreground sm:text-lg">
              <span className="font-medium text-fd-foreground">Transfert</span> is a
              local-first file toolbox — conversion, compression and cleanup that runs
              entirely on your machine. Nothing is uploaded anywhere to get a file
              converted.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={STORE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                <Download className="size-4" />
                Download for Windows
              </a>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-full border border-fd-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
              >
                <BookOpen className="size-4" />
                Read the docs
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.32} className="pt-4">
            <CopyCommand command={WINGET_COMMAND} />
          </Reveal>
        </div>
      </section>

      {/* Pitch */}
      <section className="relative overflow-hidden">
        <Flare className="top-1/2 -left-32 h-72 w-72 -translate-y-1/2 bg-white/[0.06]" />
        <div className="relative mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
          <Reveal>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-fd-border bg-fd-border sm:grid-cols-3">
              {pitches.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="flex flex-col gap-3 bg-fd-background p-6 transition-colors hover:bg-fd-card"
                >
                  <div className="flex size-9 items-center justify-center rounded-lg border border-fd-border bg-fd-card">
                    <Icon className="size-4.5 text-fd-foreground" />
                  </div>
                  <h2 className="font-semibold">{title}</h2>
                  <p className="text-sm leading-relaxed text-fd-muted-foreground">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Tools */}
      <section className="relative overflow-hidden border-t border-fd-border/60">
        <div aria-hidden className="line-grid-center absolute inset-0" />
        <Flare className="top-0 right-0 h-80 w-80 bg-white/[0.07]" />
        <div className="relative mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 px-6 py-20 sm:py-28 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <Reveal className="flex flex-col gap-4">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Tools</h2>
            <p className="text-pretty text-fd-muted-foreground">
              What's shipped today, and what's planned next. Every tool gets the same
              treatment: local processing, verified output, no surprises.
            </p>
            <Link
              href="/docs"
              className="inline-flex w-fit items-center gap-1.5 text-sm font-medium underline decoration-fd-border underline-offset-4 hover:decoration-fd-foreground"
            >
              Details in the docs
              <ArrowRight className="size-3.5" />
            </Link>
          </Reveal>

          <div className="flex flex-col gap-8">
            {toolGroups.map(({ category, tools }, groupIndex) => (
              <Reveal key={category} delay={groupIndex * 0.06}>
                <h3 className="mb-2 text-xs font-medium tracking-wide text-fd-muted-foreground uppercase">
                  {category}
                </h3>
                <div className="rounded-xl border border-fd-border bg-fd-background/60 backdrop-blur-sm">
                  {tools.map(({ name, available }, i) => (
                    <div
                      key={name}
                      className={`flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-fd-card/60 ${
                        i > 0 ? "border-t border-fd-border" : ""
                      }`}
                    >
                      <span className="text-sm">{name}</span>
                      {available ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-fd-primary/10 px-2.5 py-1 text-xs font-medium text-fd-primary">
                          <CheckCircle2 className="size-3" />
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-border px-2.5 py-1 text-xs text-fd-muted-foreground">
                          <Clock3 className="size-3" />
                          Planned
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden border-t border-fd-border/60">
        <Flare className="bottom-0 left-1/2 h-64 w-[36rem] -translate-x-1/2 bg-white/10" />
        <Reveal className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-6 py-20 text-center sm:py-24">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Give your files back their privacy.
          </h2>
          <p className="max-w-md text-fd-muted-foreground">
            Free, open-source, and it never asks where your files came from.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/docs/installation"
              className="inline-flex items-center gap-2 rounded-full bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Get started
              <ArrowRight className="size-3.5" />
            </Link>
            <a
              href="https://gitlab.com/viincnt/transfert"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-fd-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
            >
              View on GitLab
            </a>
          </div>
          <p className="pt-6 text-xs text-fd-muted-foreground">
            Distributed under the GNU General Public License v3.0.
          </p>
          <p className="text-xs text-fd-muted-foreground">
            Made with <span className="text-fd-foreground">☕</span> by{" "}
            <a
              href="https://viincnt.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-fd-foreground hover:underline"
            >
              Vincent
            </a>
          </p>
        </Reveal>
      </section>
    </main>
  );
}
