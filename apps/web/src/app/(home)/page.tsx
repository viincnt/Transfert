import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowDownRight,
  ArrowRight,
  Download,
  FileImage,
  FilePenLine,
  FileX2,
  GitFork,
  LockKeyhole,
  MonitorDown,
  WifiOff,
} from "lucide-react";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Private file tools that run on your machine",
  description:
    "Convert images and remove or edit metadata without uploading files, creating an account, or sending usage data anywhere.",
};

const tools = [
  {
    icon: FileImage,
    name: "Image conversion",
    description:
      "Move between formats without a browser tab or a temporary upload.",
    status: "Available now",
  },
  {
    icon: FileX2,
    name: "Metadata removal",
    description:
      "Remove the data that travels with an image when it should not.",
    status: "Available now",
  },
  {
    icon: FilePenLine,
    name: "Metadata editing",
    description: "Inspect and change embedded details before you share a file.",
    status: "Available now",
  },
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden bg-[#f4f3f1] text-[#18191d]">
      <div
        aria-hidden
        className="site-grain pointer-events-none fixed inset-0 z-20"
      />

      <section className="relative mx-auto max-w-[1400px] px-5 pt-12 pb-14 sm:px-8 sm:pt-16 lg:min-h-[calc(100dvh-4rem)] lg:pb-20">
        <div
          aria-hidden
          className="absolute top-8 right-[-8rem] size-[28rem] rounded-full border border-[#18191d]/10 sm:right-[4%]"
        />
        <div className="relative grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
          <div className="max-w-xl lg:pb-10">
            <Reveal>
              <p className="mb-7 flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.16em] text-[#62636a] uppercase">
                <span className="size-2 rounded-full bg-[#f06c53]" />{" "}
                Local-first file tools
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="text-[clamp(3.25rem,7vw,6.5rem)] leading-[0.9] font-semibold tracking-[-0.07em] text-balance">
                Your files <span className="text-[#f06c53]">stay</span> with
                you.
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-7 max-w-md text-lg leading-relaxed text-[#62636a] sm:text-xl">
                Transfert is a desktop toolbox for converting and cleaning files
                without sending them anywhere.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/download"
                  className="inline-flex items-center gap-2 rounded-full bg-[#18191d] px-5 py-3 text-sm font-medium text-[#fbfaf8] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <Download className="size-4" /> Download Transfert
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-full border border-[#18191d]/20 px-5 py-3 text-sm font-medium transition-colors hover:border-[#18191d] hover:bg-[#fbfaf8]"
                >
                  See it work <ArrowDownRight className="size-4" />
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="relative lg:pt-10">
            <div className="relative rotate-[-2deg] overflow-hidden rounded-[1.35rem] border border-[#18191d]/15 bg-[#18191d] p-2 shadow-[18px_20px_0_#dddcd9] transition-transform duration-500 hover:rotate-0 sm:p-3">
              <Image
                src="/Transfert-001.png"
                alt="The Transfert desktop toolbox with its file utilities"
                width={1102}
                height={701}
                className="h-auto w-full rounded-[0.85rem]"
                priority
              />
            </div>
            <div className="absolute -bottom-7 -left-3 flex items-center gap-3 rounded-xl border border-[#18191d]/15 bg-[#fbfaf8] px-4 py-3 shadow-[8px_8px_0_#f06c53] sm:-left-8">
              <span className="flex size-9 items-center justify-center rounded-full bg-[#ecebea] text-[#18191d]">
                <LockKeyhole className="size-4" />
              </span>
              <span className="text-sm leading-tight font-medium">
                Processed on your machine
                <br />
                <span className="font-normal text-[#62636a]">Always.</span>
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-[#18191d]/15 bg-[#18191d] text-[#fbfaf8]">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 divide-y divide-[#fbfaf8]/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            [WifiOff, "No upload", "Files never leave your computer."],
            [LockKeyhole, "No account", "No personal data to hand over."],
            [
              MonitorDown,
              "No tracking",
              "No telemetry. The only network request checks for updates on GitHub.",
            ],
          ].map(([Icon, title, detail]) => {
            const IconComponent = Icon as typeof WifiOff;
            return (
              <div
                key={title as string}
                className="flex items-center gap-4 px-5 py-6 sm:px-8"
              >
                <IconComponent
                  className="size-5 text-[#f06c53]"
                  strokeWidth={1.7}
                />
                <p className="text-sm leading-snug">
                  <strong className="font-medium">{title as string}</strong>
                  <br />
                  <span className="text-[#fbfaf8]/60">{detail as string}</span>
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32"
      >
        <Reveal>
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-[#f06c53] uppercase">
              A shorter route
            </p>
            <h2 className="mt-5 text-4xl leading-[0.95] font-semibold tracking-[-0.055em] text-balance sm:text-6xl">
              There is no cloud between you and a finished file.
            </h2>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] md:items-end">
          <Reveal>
            <div className="overflow-hidden rounded-[1.2rem] border border-[#18191d]/15 bg-[#18191d] p-2 shadow-[12px_14px_0_#dddcd9]">
              <Image
                src="/Transfert-002.png"
                alt="Transfert image converter ready for files to be dropped"
                width={1102}
                height={701}
                className="h-auto w-full rounded-[0.8rem]"
              />
            </div>
          </Reveal>
          <Reveal delay={0.12} className="md:pb-5">
            <p className="font-mono text-sm text-[#f06c53]">01 / DROP</p>
            <h3 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">
              Start with the file you already have.
            </h3>
            <p className="mt-4 max-w-sm leading-relaxed text-[#62636a]">
              Drag it in, or choose it from your machine. The app makes no copy
              outside your device.
            </p>
          </Reveal>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)] md:items-center">
          <Reveal className="md:order-2">
            <div className="overflow-hidden rounded-[1.2rem] border border-[#18191d]/15 bg-[#18191d] p-2 shadow-[12px_14px_0_#dddcd9]">
              <Image
                src="/Transfert-003.png"
                alt="Transfert conversion queue with output settings"
                width={1102}
                height={701}
                className="h-auto w-full rounded-[0.8rem]"
              />
            </div>
          </Reveal>
          <Reveal delay={0.12} className="md:order-1 md:pl-10">
            <p className="font-mono text-sm text-[#f06c53]">02 / FINISH</p>
            <h3 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">
              Pick an output. Keep moving.
            </h3>
            <p className="mt-4 max-w-sm leading-relaxed text-[#62636a]">
              Set the format and destination. Transfert verifies what it writes
              before it calls the job done.
            </p>
          </Reveal>
        </div>
      </section>

      <section
        id="tools"
        className="border-y border-[#18191d]/15 bg-[#ecebea] px-5 py-24 sm:px-8 sm:py-32"
      >
        <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
          <Reveal>
            <div className="sticky top-28 max-w-md">
              <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-[#f06c53] uppercase">
                Built for the mundane
              </p>
              <h2 className="mt-5 text-5xl leading-[0.92] font-semibold tracking-[-0.06em]">
                Useful tools. No ceremony.
              </h2>
              <p className="mt-6 leading-relaxed text-[#62636a]">
                The first releases focus on the file work that should take
                seconds, not a web search and an upload.
              </p>
            </div>
          </Reveal>
          <div className="border-t border-[#18191d]/15">
            {tools.map(({ icon: Icon, name, description, status }, index) => (
              <Reveal key={name} delay={index * 0.08}>
                <article className="group grid gap-4 border-b border-[#18191d]/15 py-7 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-start">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-[#fbfaf8] text-[#18191d] transition-transform group-hover:-rotate-6">
                    <Icon className="size-5" strokeWidth={1.6} />
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.03em]">
                      {name}
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-[#62636a]">
                      {description}
                    </p>
                  </div>
                  <span className="font-mono text-[11px] font-medium text-[#62636a] sm:pt-1">
                    {status}
                  </span>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="relative overflow-hidden rounded-[1.5rem] bg-[#f06c53] px-6 py-14 text-[#fbfaf8] sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="absolute -top-28 -right-20 size-[26rem] rounded-full border border-[#fbfaf8]/35"
          />
          <div
            aria-hidden
            className="absolute right-20 -bottom-32 size-[22rem] rounded-full border border-[#fbfaf8]/25"
          />
          <div className="relative max-w-2xl">
            <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-[#fbfaf8]/70 uppercase">
              Free and open source
            </p>
            <h2 className="mt-5 text-4xl leading-[0.94] font-semibold tracking-[-0.055em] text-balance sm:text-6xl">
              Let your computer do the work.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#fbfaf8]/80">
              Get a quieter, more private way to handle everyday files.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/download"
                className="inline-flex items-center gap-2 rounded-full bg-[#fbfaf8] px-5 py-3 text-sm font-medium text-[#18191d] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <Download className="size-4" /> Download Transfert
              </Link>
              <a
                href="https://github.com/viincnt/Transfert"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#fbfaf8]/50 px-5 py-3 text-sm font-medium transition-colors hover:bg-[#fbfaf8]/10"
              >
                View source <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-[#18191d]/15 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-4 text-sm text-[#62636a] sm:flex-row sm:items-center">
          <p>Transfert. A local-first file toolbox.</p>
          <div className="flex items-center gap-5">
            <a
              className="transition-colors hover:text-[#18191d]"
              href="https://github.com/viincnt/Transfert"
              target="_blank"
              rel="noreferrer"
            >
              <GitFork className="mr-1.5 inline size-4" /> GitHub
            </a>
            <Link
              className="transition-colors hover:text-[#18191d]"
              href="/privacy"
            >
              Privacy
            </Link>
            <a
              className="transition-colors hover:text-[#18191d]"
              href="https://viincnt.com"
              target="_blank"
              rel="noreferrer"
            >
              By Vincent
            </a>
            <span>GPL-3.0</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
