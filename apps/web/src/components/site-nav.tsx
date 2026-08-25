import Link from "next/link";
import { Download } from "lucide-react";
import { SearchTrigger } from "fumadocs-ui/layouts/shared/slots/search-trigger";
import { AppIcon } from "@/components/app-icon";
import { MobileMenu } from "@/components/mobile-menu";
import { appName } from "@/lib/shared";

const STORE_URL = "https://apps.microsoft.com/detail/9PG711NS9JVS";

const links = [
  { href: "/docs", label: "Docs" },
  { href: "/docs/installation", label: "Install" },
  { href: "https://gitlab.com/viincnt/transfert", label: "GitLab", external: true },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-fd-border/60 bg-fd-background/80 backdrop-blur-md">
      <div className="relative mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <AppIcon className="size-7" />
          {appName}
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-fd-muted-foreground sm:flex">
          {links.map(({ href, label, external }) => (
            <Link
              key={href}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className="transition-colors hover:text-fd-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <SearchTrigger className="text-fd-muted-foreground" />
          <a
            href={STORE_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-full bg-fd-primary px-3.5 py-1.5 text-sm font-medium text-fd-primary-foreground transition-transform hover:scale-[1.03] active:scale-[0.98] sm:inline-flex"
          >
            <Download className="size-3.5" />
            Download
          </a>
          <MobileMenu links={links} storeUrl={STORE_URL} />
        </div>
      </div>
    </header>
  );
}
