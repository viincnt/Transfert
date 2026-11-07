"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";

/** The site's own dropdown: a select-only combobox, keyboard included. */
export default function Select({
  label,
  value,
  options,
  onChange,
  side = "bottom",
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  side?: "top" | "bottom";
}) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const menuShadow =
    "shadow-[0_12px_32px_#000a]"; /* taste-skill-ignore: open menu */
  const offset = reduced ? 0 : side === "top" ? 6 : -6;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const show = () => {
    setActive(Math.max(options.indexOf(value), 0));
    setOpen(true);
  };

  const choose = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        show();
      }
      return;
    }
    const last = options.length - 1;
    const moves: Record<string, number> = {
      ArrowDown: Math.min(active + 1, last),
      ArrowUp: Math.max(active - 1, 0),
      Home: 0,
      End: last,
    };
    if (event.key in moves) {
      event.preventDefault();
      setActive(moves[event.key]);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(options[active]);
    } else if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div className="flex items-center gap-2.5">
      <span id={`${id}-label`} className="text-muted">
        {label}
      </span>
      <div className="relative" ref={root}>
        <button
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-labelledby={`${id}-label`}
          aria-activedescendant={open ? `${id}-${active}` : undefined}
          onClick={() => (open ? setOpen(false) : show())}
          onKeyDown={onKeyDown}
          className="bg-raised hover:bg-chip aria-expanded:bg-chip flex h-10 min-w-[104px] items-center justify-between gap-3 rounded-[8px] pr-2.5 pl-3 transition-colors duration-150"
        >
          {value}
          <ChevronDown
            size={16}
            strokeWidth={1.5}
            aria-hidden
            className={`text-muted transition-transform duration-200 ease-(--ease-out) ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
        <AnimatePresence>
          {open && (
            <motion.ul
              id={`${id}-list`}
              role="listbox"
              aria-labelledby={`${id}-label`}
              initial={{ opacity: 0, y: offset, scale: reduced ? 1 : 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: offset / 2,
                transition: { duration: 0.1 },
              }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className={`bg-raised absolute left-0 z-30 m-0 grid min-w-full list-none gap-0.5 rounded-[10px] p-1 ${menuShadow} ${
                side === "top"
                  ? "bottom-[calc(100%+6px)] origin-bottom"
                  : "top-[calc(100%+6px)] origin-top"
              }`}
            >
              {options.map((option, index) => (
                <li
                  key={option}
                  id={`${id}-${index}`}
                  role="option"
                  aria-selected={option === value}
                  onPointerEnter={() => setActive(index)}
                  onClick={() => choose(option)}
                  className={`flex h-9 cursor-pointer items-center justify-between gap-5 rounded-[7px] pr-2 pl-2.5 whitespace-nowrap transition-colors duration-100 ${
                    index === active ? "bg-chip" : ""
                  }`}
                >
                  {option}
                  {option === value && (
                    <Check
                      size={15}
                      strokeWidth={1.75}
                      aria-hidden
                      className="text-accent"
                    />
                  )}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
