import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

const sections = [
  {
    title: "We do not collect any data",
    body: "Transfert does not collect, store, or transmit personal data, files, or usage information. There are no analytics, crash reports, telemetry, or tracking built into the app.",
  },
  {
    title: "Your files never leave your device",
    body: "Every conversion happens entirely on your computer. Files you drop into Transfert are read from disk, processed locally, and written to a destination you choose. They are never uploaded to a server, sent over a network, or shared with a third party.",
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
    body: "Transfert does not share data with third parties because it does not collect any. Links to the source repository, the author's site, and open-source projects are governed by each destination's own privacy policy.",
  },
  {
    title: "Children's privacy",
    body: "Transfert is not directed at children and does not knowingly collect information from anyone, regardless of age, because it does not collect information at all.",
  },
  {
    title: "Changes to this policy",
    body: "If this policy changes, for example if a future feature requires network access, this page and its last-updated date will be revised.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-[#f3f1eb] px-5 py-12 text-[#172420] sm:px-8 sm:py-20">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#52605a] transition-colors hover:text-[#172420]"
        >
          <ArrowLeft className="size-4" /> Back to Transfert
        </Link>

        <header className="mt-12 border-b border-[#172420]/15 pb-10">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-[#172420] text-[#fffaf2]">
            <ShieldCheck className="size-6" strokeWidth={1.6} />
          </span>
          <p className="mt-7 font-mono text-[11px] font-medium tracking-[0.16em] text-[#f06c53] uppercase">
            Privacy policy
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.055em] text-balance sm:text-6xl">
            Your files are your business.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#52605a]">
            A plain-language policy for a local-first application.
          </p>
          <p className="mt-8 font-mono text-xs text-[#52605a]">
            Last updated: August 13, 2026
          </p>
        </header>

        <div className="divide-y divide-[#172420]/15">
          {sections.map(({ title, body }) => (
            <section
              key={title}
              className="py-8 sm:grid sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-8"
            >
              <h2 className="text-lg font-semibold tracking-[-0.025em]">
                {title}
              </h2>
              <p className="mt-3 leading-relaxed text-[#52605a] sm:mt-0">
                {body}
              </p>
            </section>
          ))}
          <section className="py-8 sm:grid sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-8">
            <h2 className="text-lg font-semibold tracking-[-0.025em]">
              Contact
            </h2>
            <p className="mt-3 leading-relaxed text-[#52605a] sm:mt-0">
              Questions about this policy:{" "}
              <a
                className="font-medium text-[#172420] underline decoration-[#f06c53] underline-offset-4"
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
