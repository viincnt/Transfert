"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Fade-and-rise entrance, triggered once when the element scrolls into view
 * (or immediately for above-the-fold content, since it's already
 * intersecting on mount). `delay` staggers siblings.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
