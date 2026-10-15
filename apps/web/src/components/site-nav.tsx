import Link from "next/link";
import { Download } from "lucide-react";
import { AppIcon } from "@/components/app-icon";
import { MobileMenu } from "@/components/mobile-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { appName } from "@/lib/shared";

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
    <header className="sticky top-0 z-30 border-b border-[#18191d]/10 bg-[#f4f3f1]/90 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight"
        >
          <span className="flex size-8 items-center justify-center rounded-[10px] bg-[#18191d] text-[#f4f3f1]">
            <AppIcon className="size-4" />
          </span>
          {appName}
          <span className="text-[#f06c53]">.</span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 text-sm font-medium text-[#62636a] md:flex"
        >
          {links.map(({ href, label, external }) => (
            <Link
              key={href}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className="nav-link transition-colors hover:text-[#18191d]"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/download"
            className="primary-button hidden min-h-10 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 active:scale-[0.98] md:inline-flex"
          >
            <Download className="size-3.5" />
            Download
          </Link>
          <MobileMenu links={links} downloadUrl="/download" />
        </div>
      </div>
    </header>
  );
}
