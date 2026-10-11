import {
  ChevronRight,
  CircleHelp,
  Languages,
  Laptop,
  Moon,
  RefreshCw,
  Sun,
  SunMoon,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useTheme } from "@/components/theme-provider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { areUpdateChecksEnabled, setUpdateChecksEnabled } from "@/lib/updates";

function SettingMark({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
      {children}
    </span>
  );
}

export function Settings() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [updateChecksEnabled, setUpdateChecksEnabledState] = useState(
    areUpdateChecksEnabled,
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8 lg:px-10 lg:py-12">
      <header className="mx-auto max-w-3xl border-b border-border pb-8">
        <p className="font-mono text-[10px] font-medium tracking-[0.16em] text-primary uppercase">
          Workspace
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em]">
          {t("settings.title")}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {t("settings.subtitle")}
        </p>
      </header>

      <div className="mx-auto mt-8 max-w-3xl">
        <div className="mb-4">
          <p className="font-mono text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Preferences
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
          <section className="flex flex-wrap items-center justify-between gap-5 p-5">
            <div className="flex items-start gap-3">
              <SettingMark>
                <SunMoon className="size-4.5" strokeWidth={1.6} />
              </SettingMark>
              <div>
                <Label>{t("settings.appearance.label")}</Label>
                <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {t("settings.appearance.description")}
                </p>
              </div>
            </div>
            <ToggleGroup
              type="single"
              variant="outline"
              value={theme}
              onValueChange={(value) => {
                if (value) setTheme(value as "light" | "dark" | "system");
              }}
              className="rounded-xl bg-muted/55 p-1"
            >
              <ToggleGroupItem
                value="light"
                aria-label={t("theme.light")}
                className="rounded-lg px-3"
              >
                <Sun />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="dark"
                aria-label={t("theme.dark")}
                className="rounded-lg px-3"
              >
                <Moon />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="system"
                aria-label={t("theme.system")}
                className="rounded-lg px-3"
              >
                <Laptop />
              </ToggleGroupItem>
            </ToggleGroup>
          </section>

          <section className="flex flex-wrap items-center justify-between gap-5 border-t border-border/80 p-5">
            <div className="flex items-start gap-3">
              <SettingMark>
                <Languages className="size-4.5" strokeWidth={1.6} />
              </SettingMark>
              <div>
                <Label>{t("settings.language.label")}</Label>
                <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {t("settings.language.description")}
                </p>
              </div>
            </div>
            <Select value="en" disabled>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </section>
          <section className="flex flex-wrap items-center justify-between gap-5 border-t border-border/80 p-5">
            <div className="flex items-start gap-3">
              <SettingMark>
                <RefreshCw className="size-4.5" strokeWidth={1.6} />
              </SettingMark>
              <div>
                <Label>{t("settings.updates.label")}</Label>
                <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {t("settings.updates.description")}
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={updateChecksEnabled}
              onClick={() => {
                const enabled = !updateChecksEnabled;
                setUpdateChecksEnabledState(enabled);
                setUpdateChecksEnabled(enabled);
              }}
              className="group relative h-7 w-12 rounded-full bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none aria-checked:bg-primary"
            >
              <span className="absolute top-1 left-1 size-5 rounded-full bg-background shadow-sm transition-transform group-aria-checked:translate-x-5" />
              <span className="sr-only">{t("settings.updates.label")}</span>
            </button>
          </section>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <div className="mb-4">
          <p className="font-mono text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Application
          </p>
        </div>
        <Link
          to="/settings/about"
          className="group flex items-center gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <SettingMark>
            <CircleHelp className="size-4.5" strokeWidth={1.6} />
          </SettingMark>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium">
              {t("settings.about.cta")}
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">
              Version, source code, license and open source credits.
            </span>
          </span>
          <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
