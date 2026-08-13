import type { SVGProps } from "react";

/**
 * The app's own mark: the same double-chevron glyph baked into the
 * packaged app icon (src/assets/icon.svg), as a plain currentColor glyph
 * with no background — drops into the same rounded badge wrappers used
 * for every lucide icon in the sidebar/about header (size-*, text-* control
 * it exactly like <Wrench /> did).
 *
 * Drawn at lucide's fill ratio (glyph spans most of the 24-unit box), not
 * the packaged icon's proportions — those leave generous safe-area padding
 * around a large squircle badge, which reads as lost/tiny once also
 * shrunk into a small UI icon slot.
 */
export function AppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 6.5 L12.25 12 L7 17.5" strokeOpacity={0.55} />
      <path d="M13.5 6.5 L18.75 12 L13.5 17.5" />
    </svg>
  );
}
