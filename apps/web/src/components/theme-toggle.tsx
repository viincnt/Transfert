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

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
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
      if (event.key === "Escape") setOpen(false);
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
    localStorage.setItem(STORAGE_KEY, nextPreference);
    applyTheme(nextPreference);
    setOpen(false);
  }

  const themes = [
    { value: "system", label: "Use system theme", icon: Monitor },
    { value: "dark", label: "Use dark theme", icon: Moon },
    { value: "light", label: "Use light theme", icon: Sun },
  ] as const;
  const CurrentIcon = themes.find((theme) => theme.value === preference)!.icon;

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Choose theme"
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex size-9 items-center justify-center rounded-full border border-[#18191d]/15 text-[#62636a] transition-colors hover:bg-[#18191d]/8 hover:text-[#18191d]"
      >
        <CurrentIcon className="size-3.5" />
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Theme"
          className="absolute top-[calc(100%+0.5rem)] right-0 z-40 flex gap-1 rounded-full border border-[#18191d]/15 bg-[#fbfaf8] p-1 shadow-lg"
        >
          {themes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              role="menuitemradio"
              aria-checked={preference === value}
              aria-label={label}
              title={label}
              onClick={() => setTheme(value)}
              className="flex size-8 items-center justify-center rounded-full text-[#62636a] transition-colors hover:bg-[#18191d]/8 hover:text-[#18191d] aria-checked:bg-[#18191d] aria-checked:text-[#fbfaf8]"
            >
              <Icon className="size-3.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
