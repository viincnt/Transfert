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
import { credits } from "@/lib/credits";

import { version as appVersion } from "../../package.json";

const SOURCE_URL = "https://github.com/viincnt/Transfert.git";
const AUTHOR_URL = "https://viincnt.com";

export function About() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8 lg:px-10 lg:py-12">
      <Button variant="ghost" size="sm" className="-ml-2" asChild>
        <Link to="/settings">
          <ChevronLeft />
          {t("about.back")}
        </Link>
      </Button>

      <section className="mx-auto mt-6 max-w-3xl overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/12">
              <AppIcon className="size-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-[-0.04em]">
                  {t("app.name")}
                </h1>
                <Badge className="border-primary-foreground/15 bg-primary-foreground/10 text-primary-foreground">
                  v{appVersion}
                </Badge>
              </div>
              <p className="mt-1 max-w-md text-sm leading-relaxed text-primary-foreground/65">
                {t("app.tagline")}
              </p>
            </div>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/65">
            Free software made by{" "}
            <a
              href={AUTHOR_URL}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary-foreground hover:underline"
            >
              {t("settings.about.author")}
            </a>
            .
          </p>
        </div>
      </section>

      <div className="mx-auto mt-8 max-w-3xl">
        <div className="mb-4">
          <p className="font-mono text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Project
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <a href={SOURCE_URL} target="_blank" rel="noreferrer">
              <FolderGit2 />
              {t("settings.about.sourceCode")}
              <ExternalLink className="size-3.5 text-muted-foreground" />
            </a>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/settings/about/license">
              <Scale />
              {t("settings.about.license")}
              <ChevronRight className="size-3.5 text-muted-foreground" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <div className="mb-4">
          <p className="font-mono text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Open source
          </p>
        </div>
        <section>
          <h2 className="text-xl font-semibold tracking-tight">
            {t("settings.credits.label")}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {t("settings.credits.description")}
          </p>
          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {credits.map((credit) => (
              <a
                key={credit.name}
                href={credit.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-border/80 bg-card px-3 py-3 shadow-sm transition-colors hover:border-foreground/30 hover:bg-accent"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <credit.icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {credit.name}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {credit.description}
                  </span>
                </span>
                <Badge variant="secondary" className="shrink-0 font-normal">
                  {credit.license}
                </Badge>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
