"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X, Download } from "lucide-react";
import Link from "next/link";

type NavLink = { href: string; label: string; external?: boolean };

export function MobileMenu({
  links,
  downloadUrl,
}: {
  links: NavLink[];
  downloadUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    }
    const desktop = window.matchMedia("(min-width: 768px)");
    function resize() {
      if (desktop.matches) setOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    desktop.addEventListener("change", resize);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
      desktop.removeEventListener("change", resize);
    };
  }, [open]);

  return (
    <div
      ref={container}
      className="md:hidden"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        ref={trigger}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        className="flex size-11 items-center justify-center rounded-full border border-[var(--line)] text-[#62636a] transition-colors hover:bg-[#18191d]/8 hover:text-[#18191d]"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2, ease: "easeOut" }}
            className="absolute inset-x-0 top-full overflow-hidden border-b border-[#18191d]/10 bg-[#f4f3f1]/95 backdrop-blur-md"
          >
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col gap-1 px-6 py-4"
            >
              {links.map(({ href, label, external }) => (
                <Link
                  key={href}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm text-[#62636a] transition-colors hover:bg-[#18191d]/8 hover:text-[#18191d]"
                >
                  {label}
                </Link>
              ))}
              <a
                href={downloadUrl}
                onClick={() => setOpen(false)}
                className="primary-button mt-2 inline-flex items-center justify-center gap-1.5 rounded-full px-3.5 py-3 text-sm font-medium"
              >
                <Download className="size-3.5" />
                Download
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
