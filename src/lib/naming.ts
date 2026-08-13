export type NamingMode = "keep" | "suffix" | "custom";

/**
 * Resolves the desired output file stem (no extension) for a naming
 * preference. Returns `undefined` for "keep original name" — callers
 * should fall back to the source's own name in that case (the backend
 * already does this when no override is given).
 *
 * Shared by any converter that offers the same naming controls
 * (`ConversionQueue` calls this internally), so the token syntax and
 * suffix behavior stay identical everywhere they show up.
 */
export function resolveFileNameOverride(
  mode: NamingMode,
  pattern: string,
  sourceName: string,
  targetExtension: string,
  index: number,
): string | undefined {
  const stem = sourceName.replace(/\.[^./\\]+$/, "") || "converted";

  switch (mode) {
    case "keep":
      return undefined;
    case "suffix":
      return `${stem}-converted`;
    case "custom": {
      const trimmed = pattern.trim();
      if (!trimmed) return undefined;
      return trimmed
        .split("{name}")
        .join(stem)
        .split("{ext}")
        .join(targetExtension.toLowerCase())
        .split("{index}")
        .join(String(index));
    }
  }
}
