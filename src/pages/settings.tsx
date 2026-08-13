import {
  ChevronRight,
  Languages,
  Laptop,
  Moon,
  Sun,
  SunMoon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

function SettingIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
      {children}
    </div>
  );
}

export function Settings() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("settings.title")}
        </h1>
        <p className="text-muted-foreground">{t("settings.subtitle")}</p>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="py-0">
          <CardContent className="flex flex-col divide-y p-0">
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
              <div className="flex items-center gap-3">
                <SettingIcon>
                  <SunMoon className="size-4.5" />
                </SettingIcon>
                <div>
                  <Label>{t("settings.appearance.label")}</Label>
                  <p className="text-sm text-muted-foreground">
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
              >
                <ToggleGroupItem
                  value="light"
                  aria-label={t("theme.light")}
                  className="px-3"
                >
                  <Sun />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="dark"
                  aria-label={t("theme.dark")}
                  className="px-3"
                >
                  <Moon />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="system"
                  aria-label={t("theme.system")}
                  className="px-3"
                >
                  <Laptop />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
              <div className="flex items-center gap-3">
                <SettingIcon>
                  <Languages className="size-4.5" />
                </SettingIcon>
                <div>
                  <Label>{t("settings.language.label")}</Label>
                  <p className="text-sm text-muted-foreground">
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
            </div>
          </CardContent>
        </Card>

        <Button
          variant="ghost"
          className="h-auto justify-start px-3 py-2"
          asChild
        >
          <Link to="/settings/about">
            <span className="text-muted-foreground">
              {t("settings.about.cta")}
            </span>
            <ChevronRight className="ml-auto size-4 text-muted-foreground" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
