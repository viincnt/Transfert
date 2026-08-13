import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FolderGit2,
  Scale,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { AppIcon } from "@/components/app-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { credits } from "@/lib/credits";

import { version as appVersion } from "../../package.json";

const SOURCE_URL = "https://gitlab.com/viincnt/transfert.git";
const AUTHOR_URL = "https://viincnt.com";

export function About() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <Button variant="ghost" size="sm" className="-ml-2 w-fit" asChild>
        <Link to="/settings">
          <ChevronLeft />
          {t("about.back")}
        </Link>
      </Button>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background">
            <AppIcon className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {t("app.name")}
              </h1>
              <Badge variant="secondary" className="font-normal">
                v{appVersion}
              </Badge>
            </div>
            <p className="text-muted-foreground">{t("app.tagline")}</p>
          </div>
        </div>

        <p className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          {t("settings.about.madeWith")}{" "}
          <span className="text-foreground">☕</span> {t("settings.about.by")}
          <a
            href={AUTHOR_URL}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            {t("settings.about.author")}
          </a>
        </p>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={SOURCE_URL} target="_blank" rel="noreferrer">
              <FolderGit2 />
              {t("settings.about.sourceCode")}
              <ExternalLink className="size-3.5 text-muted-foreground" />
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/settings/about/license">
              <Scale />
              {t("settings.about.license")}
              <span className="flex items-center gap-1.5 text-muted-foreground">
                GPL v3
                <ChevronRight className="size-3.5" />
              </span>
            </Link>
          </Button>
        </div>

        <Separator />

        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              {t("settings.credits.label")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("settings.credits.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {credits.map((credit) => (
              <a
                key={credit.name}
                href={credit.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors hover:border-foreground/30 hover:bg-accent"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <credit.icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{credit.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {credit.description}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0 font-normal">
                  {credit.license}
                </Badge>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
