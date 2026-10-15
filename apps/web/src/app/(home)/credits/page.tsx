import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Open-source credits",
  description:
    "Transfert credits VideoLAN, libVLC and the open-source projects behind its local file tools.",
  alternates: { canonical: "/credits" },
};

const projects = [
  [
    "VideoLAN / libVLC",
    "Native audio/video engine",
    "LGPL-2.1-or-later; plugin and dependency licenses vary",
    "https://www.videolan.org/vlc/libvlc.html",
  ],
  [
    "Tauri",
    "Desktop application shell",
    "MIT / Apache-2.0",
    "https://tauri.app",
  ],
  [
    "image",
    "Raster image conversion",
    "MIT / Apache-2.0",
    "https://github.com/image-rs/image",
  ],
  [
    "resvg",
    "SVG rasterization",
    "MPL-2.0",
    "https://github.com/linebender/resvg",
  ],
  [
    "pulldown-cmark",
    "Markdown parsing",
    "MIT",
    "https://github.com/pulldown-cmark/pulldown-cmark",
  ],
  ["html2text", "HTML to text", "MIT", "https://crates.io/crates/html2text"],
  ["html2md", "HTML to Markdown", "MIT", "https://crates.io/crates/html2md"],
  [
    "libloading",
    "Native library loading",
    "ISC",
    "https://github.com/nagisa/rust_libloading",
  ],
];

export default function CreditsPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="hero-section min-h-[calc(100dvh-4rem)] bg-[#f4f3f1] px-5 py-12 text-[#18191d] sm:px-8 sm:py-20"
    >
      <article className="privacy-content mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#62636a]"
        >
          <ArrowLeft className="size-4" /> Back to Transfert
        </Link>
        <h1 className="mt-12 text-5xl font-semibold tracking-[-0.055em]">
          Built on open source.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-[#62636a]">
          These projects make our local file tools possible. Their work belongs
          to their authors and contributors.
        </p>
        <section className="mt-10 space-y-4 border-y border-[#18191d]/15 py-8 leading-relaxed text-[#62636a]">
          <h2 className="text-2xl font-semibold text-[#18191d]">
            Thank you, VideoLAN.
          </h2>
          <p>
            Transfert uses libVLC, developed by VideoLAN and the VLC
            contributors, for its audio/video integration. We build the Rust
            integration and interface; we do not claim authorship of libVLC or
            its codecs.
          </p>
          <p>
            LibVLC is licensed under LGPL-2.1-or-later. Plugins and dependencies
            retain their own licenses, including GPL licenses. Codec plugins may
            include FFmpeg, x264, libvpx and Xiph.Org libraries. These native
            components run locally on your computer.
          </p>
          <p>
            VideoLAN, VLC and VLC media player are trademarks of the VideoLAN
            nonprofit organization. Transfert is an independent project and is
            not affiliated with or endorsed by VideoLAN.
          </p>
          <div className="flex flex-wrap gap-5 text-sm underline underline-offset-4">
            <a href="https://www.videolan.org/">VideoLAN</a>
            <a href="https://code.videolan.org/videolan/vlc">VLC source code</a>
            <a href="https://www.videolan.org/legal.html">
              Licenses and legal information
            </a>
          </div>
        </section>
        <ul className="divide-y divide-[#18191d]/15">
          {projects.map(([name, purpose, license, url]) => (
            <li key={name} className="py-6 sm:grid sm:grid-cols-2 sm:gap-6">
              <a
                href={url}
                className="text-lg font-semibold underline decoration-[#f06c53] underline-offset-4"
              >
                {name}
              </a>
              <div className="mt-2 text-sm leading-relaxed text-[#62636a] sm:mt-0">
                <p>{purpose}</p>
                <p>{license}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm leading-relaxed text-[#62636a]">
          More dependencies are credited in the desktop app under Settings →
          About. See the repository&apos;s{" "}
          <a
            className="underline underline-offset-4"
            href="https://github.com/viincnt/Transfert/blob/main/THIRD_PARTY_NOTICES.md"
          >
            third-party notices
          </a>{" "}
          for source and redistribution information. Transfert itself is
          GPL-3.0; this does not replace the licenses of its dependencies.
        </p>
      </article>
    </main>
  );
}
