import { ChevronLeft, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

import licenseText from "../../LICENSE?raw";

const LICENSE_URL = "https://www.gnu.org/licenses/gpl-3.0.html";

export function License() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <div className="sticky top-0 z-10 flex flex-col gap-4 border-b bg-background px-6 pt-6 pb-4">
        <Button variant="ghost" size="sm" className="-ml-2 w-fit" asChild>
          <Link to="/settings/about">
            <ChevronLeft />
            {t("license.back")}
          </Link>
        </Button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {t("license.title")}
            </h1>
            <p className="text-muted-foreground">{t("license.subtitle")}</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={LICENSE_URL} target="_blank" rel="noreferrer">
              {t("license.readOnGnu")}
              <ExternalLink className="size-3.5 text-muted-foreground" />
            </a>
          </Button>
        </div>
      </div>

      <pre className="px-6 pt-6 pb-6 font-mono text-xs leading-relaxed whitespace-pre-wrap text-muted-foreground">
        {licenseText}
      </pre>
    </div>
  );
}
