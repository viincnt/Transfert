const aliases: Record<string, string> = {
  JPEG: "JPG",
  JPE: "JPG",
  TIF: "TIFF",
  HTM: "HTML",
  MARKDOWN: "MD",
  WAVE: "WAV",
};

export function normalizeFormat(format: string): string {
  const upper = format.toUpperCase();
  return aliases[upper] ?? upper;
}

/** Show canonical formats once, while accepting their supported aliases. */
export function conversionInputs(inputs: string[], outputs: string[]) {
  const outputFormats = new Set(outputs.map(normalizeFormat));
  const accepted = inputs.filter((format) =>
    outputFormats.has(normalizeFormat(format)),
  );
  const supported = new Set(accepted.map(normalizeFormat));
  return {
    formats: [...new Set(outputs.map(normalizeFormat))].filter((format) =>
      supported.has(format),
    ),
    accept: [
      ...new Set(accepted.map((format) => `.${format.toLowerCase()}`)),
    ].join(","),
  };
}

export function isSourceFormat(file: File, format: string): boolean {
  const extension = file.name.includes(".") ? file.name.split(".").pop()! : "";
  return normalizeFormat(extension) === normalizeFormat(format);
}
