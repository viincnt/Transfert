import { ChevronLeft, ExternalLink, Scale } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

import licenseText from "../../../../LICENSE?raw";

const LICENSE_URL = "https://www.gnu.org/licenses/gpl-3.0.html";

export function License() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8 lg:px-10 lg:py-12">
      <Button variant="ghost" size="sm" className="-ml-2" asChild>
        <Link to="/settings/about">
          <ChevronLeft />
          {t("license.back")}
        </Link>
      </Button>

      <header className="mx-auto mt-6 flex max-w-3xl flex-col items-start gap-5 border-b border-border pb-8">
        <div>
          <p className="font-mono text-[10px] font-medium tracking-[0.16em] text-primary uppercase">
            Legal
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
              <Scale className="size-4.5" />
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.04em]">
                {t("license.title")}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("license.subtitle")}
              </p>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href={LICENSE_URL} target="_blank" rel="noreferrer">
            {t("license.readOnGnu")}
            <ExternalLink className="size-3.5 text-muted-foreground" />
          </a>
        </Button>
      </header>

      <article className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
        <div className="border-b border-border/80 bg-secondary/45 px-5 py-3 font-mono text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
          GNU General Public License v3.0
        </div>
        <pre className="max-h-[calc(100dvh-19rem)] overflow-y-auto px-5 py-6 font-mono text-xs leading-relaxed whitespace-pre-wrap text-muted-foreground">
          {licenseText}
        </pre>
      </article>
    </div>
  );
}
