import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "Learn how Transfert processes files locally and why it does not collect personal data, telemetry, or analytics.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    title: "We do not collect any data",
    body: "Transfert does not collect personal data, files, or usage information for itself or send them to a service. There are no analytics, crash reports, telemetry, or tracking built into the app. Files are read and written locally to perform the operations you request.",
  },
  {
    title: "Your files never leave your device",
    body: "Every conversion happens entirely on your computer. Files you drop into Transfert are read from disk, processed locally, and written to a destination you choose. They are never uploaded to a server, sent over a network, or shared with a third party.",
  },
  {
    title: "Local conversion engines",
    body: "Audio and video conversion uses libVLC, developed by VideoLAN and its contributors, through a local Rust integration. LibVLC and its codec plugins run on your device, not in a VideoLAN cloud service. Transfert does not send your files to VideoLAN or use libVLC to stream files or retrieve online media metadata. Images and text documents use local Rust libraries.",
  },
  {
    title: "Temporary files",
    body: "Conversions may create working copies in your operating system's temporary directory. These are removed when the operation finishes or returns an error. An unexpected application or system shutdown may leave temporary files behind. Completed outputs remain in your chosen destination until you remove them.",
  },
  {
    title: "Optional update checks",
    body: "When automatic update checks are enabled, Transfert checks the latest public GitHub Release on startup. You can disable automatic checks in Settings or check manually from About. These requests contain no files, account details, analytics, or usage data. File conversion does not need these requests.",
  },
  {
    title: "No accounts, no sign-up",
    body: "Transfert does not require or offer account creation, login, or authentication. There is no user profile on your device or anywhere else.",
  },
  {
    title: "App permissions",
    body: "Transfert requests file and folder access only when you choose files or a destination in the native picker. It may also ask permission to open an external link in your browser when you select one inside the app. Neither permission is used to collect or transmit data.",
  },
  {
    title: "Third parties",
    body: "The update check uses GitHub's public Releases API. GitHub may process standard connection data under its own privacy policy. Links to external sites are governed by each destination's policy. Using third-party libraries locally does not share files with their authors. Transfert is an independent project and is not affiliated with or endorsed by VideoLAN.",
  },
  {
    title: "Children's privacy",
    body: "Transfert is not directed at children and does not knowingly collect information from anyone, regardless of age, because it does not collect information at all.",
  },
  {
    title: "Changes to this policy",
    body: "If this policy changes, for example if the app makes a new kind of network request, this page and its last-updated date will be revised.",
  },
];

export default function PrivacyPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="hero-section min-h-[calc(100dvh-4rem)] bg-[#f4f3f1] px-5 py-12 text-[#18191d] sm:px-8 sm:py-20"
    >
      <article className="privacy-content mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#62636a] transition-colors hover:text-[#18191d]"
        >
          <ArrowLeft className="size-4" /> Back to Transfert
        </Link>

        <header className="mt-12 border-b border-[#18191d]/15 pb-10">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-[#18191d] text-[#fbfaf8]">
            <ShieldCheck className="size-6" strokeWidth={1.6} />
          </span>
          <p className="mt-7 font-mono text-[11px] font-medium tracking-[0.16em] text-[#f06c53] uppercase">
            Privacy policy
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.055em] text-balance sm:text-6xl">
            Your files are your business.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#62636a]">
            A plain-language policy for a local-first application.
          </p>
          <p className="mt-8 font-mono text-xs text-[#62636a]">
            Last updated: October 15, 2026
          </p>
        </header>

        <div className="divide-y divide-[#18191d]/15">
          <p className="py-6 text-sm text-[#62636a]">
            Open-source attribution and license links are available in our{" "}
            <Link href="/credits" className="underline underline-offset-4">
              third-party credits
            </Link>
            .
          </p>
          {sections.map(({ title, body }) => (
            <section
              key={title}
              className="py-8 sm:grid sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-8"
            >
              <h2 className="text-lg font-semibold tracking-[-0.025em]">
                {title}
              </h2>
              <p className="mt-3 leading-relaxed text-[#62636a] sm:mt-0">
                {body}
              </p>
            </section>
          ))}
          <section className="py-8 sm:grid sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-8">
            <h2 className="text-lg font-semibold tracking-[-0.025em]">
              Contact
            </h2>
            <p className="mt-3 leading-relaxed text-[#62636a] sm:mt-0">
              Questions about this policy:{" "}
              <a
                className="font-medium text-[#18191d] underline decoration-[#f06c53] underline-offset-4"
                href="https://viincnt.com"
                target="_blank"
                rel="noreferrer"
              >
                viincnt.com
              </a>
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
