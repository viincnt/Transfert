/**
 * A single soft, blurred color blob used as a background accent. Stack a
 * few per section (different position/color/size via `className`) to break
 * up an otherwise flat black background without turning it into a real
 * color scheme — keep opacities low (/10-/20).
 */
export function Flare({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-3xl ${className ?? ""}`}
    />
  );
}
