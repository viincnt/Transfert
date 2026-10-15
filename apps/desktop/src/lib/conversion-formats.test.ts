import { describe, expect, it } from "vitest";
import { conversionInputs, isSourceFormat } from "./conversion-formats";

describe("source format matching", () => {
  it.each([
    ["photo.JPEG", "JPG"],
    ["photo.jpe", "JPG"],
    ["scan.tif", "TIFF"],
    ["page.HTM", "HTML"],
    ["notes.markdown", "MD"],
    ["audio.wave", "WAV"],
    ["photo.backup.PNG", "png"],
  ])("recognizes %s as %s", (name, format) => {
    expect(isSourceFormat(new File([], name), format)).toBe(true);
  });

  it("does not disable unrelated formats or guess extensionless files", () => {
    expect(isSourceFormat(new File([], "png"), "PNG")).toBe(false);
    expect(isSourceFormat(new File([], "file.png.jpg"), "PNG")).toBe(false);
    expect(isSourceFormat(new File([], "photo.png"), "WEBP")).toBe(false);
  });
});

describe("converter input formats", () => {
  it("only advertises and accepts formats that have an output", () => {
    expect(
      conversionInputs(
        ["MP3", "FLAC", "WAV", "APE", "WMA"],
        ["WAV", "FLAC", "MP3", "OGG"],
      ),
    ).toEqual({
      formats: ["WAV", "FLAC", "MP3"],
      accept: ".mp3,.flac,.wav",
    });
  });

  it("shows aliases once but retains them in the native picker filter", () => {
    expect(
      conversionInputs(
        ["JPG", "JPEG", "JPE", "TIFF", "TIF", "DDS"],
        ["JPG", "TIFF", "AVIF"],
      ),
    ).toEqual({
      formats: ["JPG", "TIFF"],
      accept: ".jpg,.jpeg,.jpe,.tiff,.tif",
    });
  });
});
