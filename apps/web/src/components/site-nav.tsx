import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";
import { AppIcon } from "@/components/app-icon";
import { MobileMenu } from "@/components/mobile-menu";
import { appName } from "@/lib/shared";

const STORE_URL = "https://apps.microsoft.com/detail/9PG711NS9JVS";

const links = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#tools", label: "Tools" },
  { href: "/privacy", label: "Privacy" },
  {
    href: "https://github.com/viincnt/Transfert",
    label: "GitHub",
    external: true,
  },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#172420]/10 bg-[#f3f1eb]/90 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight"
        >
          <span className="flex size-8 items-center justify-center rounded-[10px] bg-[#172420] text-[#f3f1eb]">
            <AppIcon className="size-4" />
          </span>
          {appName}
          <span className="text-[#f06c53]">.</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-[#52605a] sm:flex">
          {links.map(({ href, label, external }) => (
            <Link
              key={href}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className="transition-colors hover:text-[#172420]"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={STORE_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-full bg-[#172420] px-4 py-2 text-sm font-medium text-[#fffaf2] transition-transform hover:-translate-y-0.5 active:scale-[0.98] sm:inline-flex"
          >
            <Download className="size-3.5" />
            Download <ArrowUpRight className="size-3.5" />
          </a>
          <MobileMenu links={links} storeUrl={STORE_URL} />
        </div>
      </div>
    </header>
  );
}
