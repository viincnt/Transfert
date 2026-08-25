/**
 * Mimics the browser's <input accept> matching so drag-and-drop (which the
 * `accept` attribute never filters, only the native file picker dialog does)
 * gets the same validation.
 *
 * The accept string is parsed once into `AcceptPattern[]` (see
 * `parseAcceptPatterns`) and that parsed form is what gets matched against
 * files, so a component can parse it once (e.g. via `useMemo`) instead of
 * re-splitting the same string on every drop/selection.
 */

type AcceptPattern =
  | { kind: "extension"; value: string }
  | { kind: "wildcard"; value: string }
  | { kind: "exact"; value: string };

export function parseAcceptPatterns(accept?: string): AcceptPattern[] {
  if (!accept) return [];

  return accept
    .split(",")
    .map((pattern) => pattern.trim())
    .filter(Boolean)
    .map((pattern): AcceptPattern => {
      if (pattern.startsWith(".")) {
        return { kind: "extension", value: pattern.toLowerCase() };
      }
      if (pattern.endsWith("/*")) {
        return { kind: "wildcard", value: pattern.slice(0, -1) };
      }
      return { kind: "exact", value: pattern };
    });
}

function matchesPatterns(file: File, patterns: AcceptPattern[]): boolean {
  if (patterns.length === 0) return true;

  return patterns.some((pattern) => {
    switch (pattern.kind) {
      case "extension":
        return file.name.toLowerCase().endsWith(pattern.value);
      case "wildcard":
        return file.type.startsWith(pattern.value);
      case "exact":
        return file.type === pattern.value;
    }
  });
}

export function filterFilesByAccept(files: File[], patterns: AcceptPattern[]) {
  const accepted: File[] = [];
  const rejected: File[] = [];

  for (const file of files) {
    (matchesPatterns(file, patterns) ? accepted : rejected).push(file);
  }

  return { accepted, rejected };
}
