import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, FlaskConical, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { toolEntries } from "@/lib/tools";
import { cn } from "@/lib/utils";

function ToolCard({
  icon: Icon,
  name,
  description,
  available,
  experimental = false,
  featured = false,
}: {
  icon: LucideIcon;
  name: string;
  description: string;
  available: boolean;
  experimental?: boolean;
  featured?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <article
      className={cn(
        "group relative flex min-h-48 flex-col justify-between overflow-hidden rounded-2xl border border-border/90 bg-card p-5 transition-transform duration-200",
        available && "hover:-translate-y-1",
        featured && "bg-primary text-primary-foreground",
        !available && "opacity-60",
      )}
    >
      {featured && (
        <>
          <div
            aria-hidden
            className="absolute -top-16 -right-10 size-48 rounded-full border border-primary-foreground/15"
          />
          <div
            aria-hidden
            className="absolute right-8 -bottom-18 size-32 rounded-full border border-primary-foreground/10"
          />
        </>
      )}
      <div className="relative flex items-start justify-between gap-4">
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-xl bg-secondary text-primary",
            featured && "bg-primary-foreground/12 text-primary-foreground",
          )}
        >
          <Icon className="size-5" strokeWidth={1.6} />
        </span>
        {available ? (
          <span
            className={cn(
              "flex items-center gap-1 text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase",
              featured && "text-primary-foreground/65",
            )}
          >
            {experimental ? (
              <FlaskConical className="size-3" />
            ) : (
              <Check className="size-3" />
            )}
            {experimental ? "Experimental" : "Ready"}
          </span>
        ) : (
          <span className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
            {t("tools.comingSoon")}
          </span>
        )}
      </div>
      <div className="relative mt-8">
        <h3 className="text-xl font-semibold tracking-tight">{name}</h3>
        <p
          className={cn(
            "mt-1.5 max-w-xs text-sm leading-relaxed text-muted-foreground",
            featured && "text-primary-foreground/65",
          )}
        >
          {description}
        </p>
      </div>
      {available && (
        <ArrowUpRight
          className={cn(
            "absolute right-5 bottom-5 size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
            featured && "text-primary-foreground/70",
          )}
        />
      )}
    </article>
  );
}

export function Home() {
  const { t } = useTranslation();
  const groups = toolEntries.filter((entry) => entry.type === "group");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pt-8 pb-12 lg:px-10 lg:pt-12">
      <section className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-end">
        <div>
          <p className="mb-4 flex items-center gap-2 font-mono text-[10px] font-medium tracking-[0.16em] text-primary uppercase">
            <span className="size-1.5 rounded-full bg-primary" /> Toolbox
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.045em] text-balance sm:text-5xl">
            {t("home.title")}, without the cloud.
          </h1>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground lg:pb-1">
          {t("home.subtitle")} Every job runs on this machine, and every result
          is verified before it is saved.
        </p>
      </section>

      {groups.map((entry, groupIndex) => (
        <section key={entry.id}>
          <div className="mb-5 flex items-center gap-3">
            <entry.icon className="size-4 text-primary" strokeWidth={1.7} />
            <h2 className="text-sm font-medium">{t(entry.nameKey)}</h2>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {entry.items.map((item, index) => {
              const card = (
                <ToolCard
                  icon={item.icon}
                  name={t(item.nameKey)}
                  description={t(item.descriptionKey)}
                  available={item.available}
                  experimental={item.id === "audio"}
                  featured={groupIndex === 0 && index === 0}
                />
              );

              return item.available ? (
                <Link
                  key={item.id}
                  to={item.path}
                  className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
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
      ))}

      <section className="flex items-center gap-4 rounded-2xl border border-border bg-secondary/65 px-5 py-4 text-sm text-muted-foreground">
        <Sparkles className="size-4 shrink-0 text-primary" />
        <p>
          More local tools are on the way. The promise stays the same: no
          upload, no account, no surprises.
        </p>
      </section>
    </div>
  );
}
