import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toolEntries } from "@/lib/tools";
import { cn } from "@/lib/utils";

function ToolCard({
  icon: Icon,
  name,
  description,
  available,
}: {
  icon: LucideIcon;
  name: string;
  description: string;
  available: boolean;
}) {
  const { t } = useTranslation();

  return (
    <Card
      className={cn(
        "h-full transition-colors",
        available ? "cursor-pointer hover:ring-primary/50" : "opacity-60",
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex size-9 items-center justify-center rounded-md bg-muted">
            <Icon className="size-4.5" />
          </div>
          {!available && (
            <Badge variant="secondary">{t("tools.comingSoon")}</Badge>
          )}
        </div>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

export function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("home.title")}
        </h1>
        <p className="text-muted-foreground">{t("home.subtitle")}</p>
      </div>

      {toolEntries.map((entry) => {
        if (entry.type === "group") {
          return (
            <section key={entry.id} className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <entry.icon className="size-4" />
                <h2 className="text-sm font-medium">{t(entry.nameKey)}</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {entry.items.map((item) => {
                  const card = (
                    <ToolCard
                      icon={item.icon}
                      name={t(item.nameKey)}
                      description={t(item.descriptionKey)}
                      available={item.available}
                    />
                  );

                  return item.available ? (
                    <Link key={item.id} to={item.path}>
                      {card}
                    </Link>
                  ) : (
                    <div key={item.id} className="cursor-not-allowed">
                      {card}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        }

        return null;
      })}

      {toolEntries.some((entry) => entry.type === "single") && (
        <section className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {toolEntries
              .filter((entry) => entry.type === "single")
              .map((entry) => {
                const card = (
                  <ToolCard
                    icon={entry.icon}
                    name={t(entry.nameKey)}
                    description={t(entry.descriptionKey)}
                    available={entry.available}
                  />
                );

                return entry.available ? (
                  <Link key={entry.id} to={entry.path}>
                    {card}
                  </Link>
                ) : (
                  <div key={entry.id} className="cursor-not-allowed">
                    {card}
                  </div>
                );
              })}
          </div>
        </section>
      )}
    </div>
  );
}
