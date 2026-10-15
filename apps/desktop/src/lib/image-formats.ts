import { conversionInputs } from "./conversion-formats";

export const IMAGE_OUTPUT_FORMATS = [
  "PNG",
  "JPG",
  "WEBP",
  "GIF",
  "BMP",
  "TIFF",
  "AVIF",
  "ICO",
  "SVG",
  "QOI",
  "TGA",
  "PNM",
  "HDR",
  "EXR",
  "FF",
];

// AVIF encoding is supported; decoding needs an additional decoder that is
// not included in the Rust image engine. Keep the accepted list honest.
export const IMAGE_SUPPORTED_INPUT_FORMATS = [
  "PNG",
  "JPG",
  "JPEG",
  "JPE",
  "WEBP",
  "GIF",
  "BMP",
  "TIFF",
  "TIF",
  "ICO",
  "SVG",
  "QOI",
  "TGA",
  "PNM",
  "PBM",
  "PGM",
  "PPM",
  "PAM",
  "HDR",
  "EXR",
  "FF",
  "DDS",
];
const inputs = conversionInputs(
  IMAGE_SUPPORTED_INPUT_FORMATS,
  IMAGE_OUTPUT_FORMATS,
);
export const IMAGE_INPUT_FORMATS = inputs.formats;
export const IMAGE_ACCEPT = inputs.accept;
