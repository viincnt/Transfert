"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "transfert-site-theme";

type ThemePreference = "system" | "dark" | "light";

function applyTheme(preference: ThemePreference) {
  if (preference === "system") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = preference;
  }
}

export function ThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>("system");
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* Storage may be unavailable. */
    }
    const nextPreference: ThemePreference =
      saved === "dark" || saved === "light" ? saved : "system";
    setPreference(nextPreference);
    applyTheme(nextPreference);
  }, []);

  useEffect(() => {
    function closeMenu(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (
        event.key === "Escape" &&
        menuRef.current?.contains(document.activeElement)
      ) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function setTheme(nextPreference: ThemePreference) {
    setPreference(nextPreference);
    try {
      localStorage.setItem(STORAGE_KEY, nextPreference);
    } catch {
      /* The theme still applies for this visit. */
    }
    applyTheme(nextPreference);
    setOpen(false);
    triggerRef.current?.focus();
  }

  const themes = [
    { value: "light", label: "Claro", icon: Sun },
    { value: "dark", label: "Escuro", icon: Moon },
    { value: "system", label: "Sistema", icon: Monitor },
  ] as const;
  const CurrentIcon = themes.find((theme) => theme.value === preference)!.icon;

  return (
    <div
      ref={menuRef}
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        ref={triggerRef}
        onClick={() => setOpen((value) => !value)}
        aria-label="Escolher tema"
        aria-expanded={open}
        aria-controls="theme-options"
        title="Escolher tema"
        className="inline-flex size-11 items-center justify-center rounded-full border border-[#18191d]/15 text-[#62636a] transition-colors hover:bg-[#18191d]/8 hover:text-[#18191d]"
      >
        <CurrentIcon className="size-3.5" />
      </button>
      {open && (
        <div
          id="theme-options"
          role="group"
          aria-label="Tema"
          className="absolute top-[calc(100%+0.5rem)] right-0 z-40 grid min-w-36 gap-1 rounded-2xl border border-[#18191d]/15 bg-[#fbfaf8] p-1.5 shadow-xl"
        >
          {themes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              aria-pressed={preference === value}
              aria-label={label}
              onClick={() => setTheme(value)}
              className="theme-option flex min-h-10 items-center gap-2.5 rounded-xl px-3 text-left text-sm font-medium text-[#62636a] transition-colors hover:bg-[#18191d]/8 hover:text-[#18191d]"
            >
              <Icon className="size-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
