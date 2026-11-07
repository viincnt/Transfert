import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

const icon = { strokeWidth: 1.5, "aria-hidden": true } as const;

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("legalLayout");
  return (
    <>
      <header className="bg-bg fixed inset-x-0 top-0 z-50 h-(--nav)">
        <div className="frame flex h-full items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[1.25rem] tracking-[-0.02em]"
            aria-label={t("logoLabel")}
          >
            {t("logoText")}
          </Link>
          <Link
            href="/"
            className="text-muted hover:text-ink flex h-11 items-center gap-1.5 text-[0.9375rem] transition-colors duration-200"
          >
            {t("back")}
            <ArrowRight size={14} {...icon} />
          </Link>
        </div>
      </header>

      <main className="pt-(--nav)">
        <div className="frame max-w-[720px] py-16 md:py-24">
          {title && (
            <>
              <p className="text-muted text-ui mb-3">{updated}</p>
              <h1 className="text-head tracking-[-0.025em]">{title}</h1>
            </>
          )}
          <div className={title ? "legal-prose mt-10" : ""}>{children}</div>
        </div>
      </main>

      <footer className="frame text-ui text-muted pb-8">
        <div className="border-line flex flex-wrap gap-x-5 gap-y-1 border-t pt-6">
          <span>{t("copyright", { year: new Date().getFullYear() })}</span>
          <Link
            href="/privacy"
            className="hover:text-ink transition-colors duration-200"
          >
            {t("privacyPolicy")}
          </Link>
          <Link
            href="/terms"
            className="hover:text-ink transition-colors duration-200"
          >
            {t("termsOfUse")}
          </Link>
        </div>
      </footer>
    </>
  );
}
