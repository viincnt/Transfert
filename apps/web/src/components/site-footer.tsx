import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AppIcon } from "@/components/app-icon";
import { Copyright } from "@/components/copyright";

export function SiteFooter() {
  return (
    <footer className="site-footer border-t border-[var(--line)] px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-8 md:flex-row md:items-center">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-base font-semibold tracking-tight"
          >
            <AppIcon className="size-5" /> Transfert
            <span className="text-[var(--accent)]">.</span>
          </Link>
          <p className="mt-2 text-sm text-[var(--muted)]">
            A little less cloud. A little more control.
          </p>
          <div className="mt-4">
            <Copyright />
          </div>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--muted)]"
        >
          <Link className="footer-link" href="/download">
            Download
          </Link>
          <Link className="footer-link" href="/privacy">
            Privacy
          </Link>
          <a
            className="footer-link inline-flex items-center gap-1"
            href="https://github.com/viincnt/Transfert"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <ArrowUpRight size={14} />
          </a>
          <a
            className="footer-link"
            href="https://viincnt.com"
            target="_blank"
            rel="noreferrer"
          >
            By Vincent
          </a>
          <span className="rounded-full border border-[var(--line)] px-3 py-1 font-mono text-[10px]">
            GPL-3.0
          </span>
        </nav>
      </div>
    </footer>
  );
}
