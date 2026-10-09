"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, Download } from "lucide-react";
import Link from "next/link";

type NavLink = { href: string; label: string; external?: boolean };

export function MobileMenu({
  links,
  storeUrl,
}: {
  links: NavLink[];
  storeUrl: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex size-9 items-center justify-center rounded-full text-[#62636a] transition-colors hover:bg-[#18191d]/8 hover:text-[#18191d]"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-x-0 top-full overflow-hidden border-b border-[#18191d]/10 bg-[#f4f3f1]/95 backdrop-blur-md"
          >
            <nav className="flex flex-col gap-1 px-6 py-4">
              {links.map(({ href, label, external }) => (
                <Link
                  key={href}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-2 text-sm text-[#62636a] transition-colors hover:bg-[#18191d]/8 hover:text-[#18191d]"
                >
                  {label}
                </Link>
              ))}
              <a
                href={storeUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#18191d] px-3.5 py-2 text-sm font-medium text-[#fbfaf8]"
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
