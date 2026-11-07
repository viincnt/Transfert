"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function SiteNav() {
  const t = useTranslations("nav");
  const [current, setCurrent] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { id: "features", label: t("features"), className: "" },
    {
      id: "privacy",
      label: t("privacy"),
      className: "hidden min-[420px]:flex",
    },
    { id: "faq", label: t("faq"), className: "" },
  ];

  useEffect(() => {
    const spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setCurrent(entry.target.id);
          } else {
            setCurrent((id) => (id === entry.target.id ? null : id));
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const { id } of links) {
      const section = document.getElementById(id);
      if (section) spy.observe(section);
    }
    const onScroll = () => setScrolled(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      spy.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="bg-bg fixed inset-x-0 top-0 z-50 h-(--nav)">
      <div className="frame grid h-full grid-cols-[auto_1fr] items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        <a
          className="inline-flex items-center gap-2 justify-self-start text-[1.25rem] tracking-[-0.02em]"
          href="#home"
          aria-label={t("logoLabel")}
        >
          Transfert
        </a>
        <nav
          className="flex justify-end gap-3.5 md:justify-center md:gap-6"
          aria-label={t("mainNavLabel")}
        >
          {links.map(({ id, label, className }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={current === id ? "location" : undefined}
              className={`text-muted hover:text-ink aria-[current]:text-ink flex h-11 items-center text-[0.9375rem] transition-colors duration-200 md:text-base ${className}`}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 justify-self-end md:flex">
          <Link
            href="/download"
            className="text-muted hover:text-ink h-10 items-center transition-colors duration-200 md:flex"
          >
            Download
          </Link>
          <a
            className={`h-10 items-center rounded-[8px] px-3.5 font-medium transition-colors duration-300 md:flex ${
              scrolled
                ? "bg-ink text-bg hover:bg-accent hover:text-bg"
                : "hover:text-accent bg-transparent"
            }`}
            href="#availability"
          >
            {t("learnMore")}
          </a>
        </div>
      </div>
    </header>
  );
}
