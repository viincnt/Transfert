"use client";

import { useEffect } from "react";
import Lenis from "lenis";

const anchorEasing = (t: number) =>
  t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2;

/** The page's slow scroll, its anchor travel and its once-only reveals. */
export default function MotionRoot() {
  useEffect(() => {
    const reveals = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          reveals.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((element) => reveals.observe(element));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lenis = reduced.matches
      ? null
      : new Lenis({ autoRaf: true, lerp: 0.07, wheelMultiplier: 0.85 });

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      const target = link && document.getElementById(link.hash.slice(1));
      if (!target) return;
      event.preventDefault();
      history.pushState(null, "", link.hash);
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      if (lenis) {
        // Lenis already honours the page's scroll-padding-top.
        lenis.scrollTo(target.id === "inicio" ? 0 : target, {
          duration: 2.2,
          easing: anchorEasing,
        });
      } else {
        target.scrollIntoView();
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      reveals.disconnect();
      lenis?.destroy();
    };
  }, []);

  return null;
}
