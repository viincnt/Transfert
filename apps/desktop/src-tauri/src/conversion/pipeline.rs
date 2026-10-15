use std::fs;
use std::path::Path;

use image::{imageops::FilterType, DynamicImage};

use crate::naming::sanitize_stem;

use super::decode::decode_named_source;
use super::error::ConversionError;
use super::format::OutputFormat;
use super::svg_wrap;

pub struct ConvertedImage {
    pub bytes: Vec<u8>,
    pub file_name: String,
    pub width: u32,
    pub height: u32,
}

/// ICO frames can't exceed this on either axis — the `image` crate's own
/// encoder rejects anything bigger outright.
const ICO_MAX_DIMENSION: u32 = 256;

/// Decodes `source_bytes` (rasterizing SVG first if that's what it is) and
/// re-encodes to `target_format`, with an optional maximum edge length.
/// Nothing is written to any real destination here — that's the caller's job
/// (see `delivery::write_verified`), which keeps this reusable for both
/// folder delivery and zip bundles.
///
/// Resizing uses the pure-Rust `image` crate, so this remains identical across
/// supported operating systems and does not need a system image library.
pub fn convert_to_bytes_with_max_dimension(
    source_bytes: &[u8],
    source_name: &str,
    target_format: OutputFormat,
    name_override: Option<&str>,
    max_dimension: Option<u32>,
) -> Result<ConvertedImage, ConversionError> {
    let source_image = decode_named_source(source_bytes, source_name)?;

    let source_image = match max_dimension {
        Some(max_dimension) => fit_within_bounds(source_image, max_dimension),
        None => source_image,
    };

    if target_format == OutputFormat::Svg {
        return svg_wrap::encode(source_image, source_name, name_override);
    }

    // ICO requires each frame to be at most 256x256 — a real photo almost
    // never is, so scale it down (preserving aspect ratio) instead of
    // just failing on anything larger than an icon.
    let image_to_encode = if target_format == OutputFormat::Ico {
        fit_within_ico_bounds(source_image)
    } else {
        source_image
    };
    let (expected_width, expected_height) = (image_to_encode.width(), image_to_encode.height());
    let image_to_encode = match target_format {
        OutputFormat::Exr => DynamicImage::ImageRgba32F(image_to_encode.to_rgba32f()),
        OutputFormat::Hdr => DynamicImage::ImageRgb32F(image_to_encode.to_rgb32f()),
        OutputFormat::Farbfeld => DynamicImage::ImageRgba16(image_to_encode.to_rgba16()),
        OutputFormat::Pnm => DynamicImage::ImageRgb8(image_to_encode.to_rgb8()),
        _ => image_to_encode,
    };

    let workdir = tempfile::Builder::new().prefix("transfert-").tempdir()?;
    let temp_path = workdir
        .path()
        .join(format!("output.{}", target_format.extension()));

    let codec_format = target_format
        .image_format()
        .expect("only Svg (handled above) has no image::ImageFormat");
    image_to_encode.save_with_format(&temp_path, codec_format)?;

    let bytes = fs::read(&temp_path)?;
    // `workdir` (and the temp file inside it) is removed here, on drop.

    // Before returning, re-check what was actually written. For every
    // format but AVIF that means re-decoding it and comparing dimensions
    // — a corrupt/truncated encode won't decode cleanly, or will report
    // the wrong size, and either way this catches it here instead of
    // handing the caller a bad file.
    if target_format == OutputFormat::Avif {
        verify_avif_container(&bytes)?;
    } else {
        let verified = image::load_from_memory_with_format(&bytes, codec_format)
            .map_err(|_| ConversionError::IntegrityCheck)?;
        if verified.width() != expected_width || verified.height() != expected_height {
            return Err(ConversionError::IntegrityCheck);
        }
    }

    Ok(ConvertedImage {
        file_name: renamed(source_name, target_format, name_override),
        width: expected_width,
        height: expected_height,
        bytes,
    })
}

fn fit_within_ico_bounds(image: DynamicImage) -> DynamicImage {
    let resized = fit_within_bounds(image, ICO_MAX_DIMENSION);

    // The `image` crate's own ICO *decoder* rejects PNG-backed frames
    // that aren't RGBA — a source without an alpha channel (most JPEGs)
    // would otherwise encode fine but fail our own re-decode check. Force
    // RGBA8 so the frame is always something the decoder accepts.
    DynamicImage::ImageRgba8(resized.to_rgba8())
}

fn fit_within_bounds(image: DynamicImage, max_dimension: u32) -> DynamicImage {
    if max_dimension == 0 || (image.width() <= max_dimension && image.height() <= max_dimension) {
        image
    } else {
        image.resize(max_dimension, max_dimension, FilterType::Lanczos3)
    }
}

/// The `image` crate can *encode* AVIF (via `ravif`, pure Rust) but can't
/// *decode* it back without the much heavier `avif-native` feature, which
/// needs the native `dav1d` library — exactly the kind of system
/// dependency choosing `image` over libvips was meant to avoid. So unlike
/// every other format here, this can't fully re-decode-and-compare its
/// own output. Instead it checks the file has a well-formed ISOBMFF
/// header with an AVIF brand, which still catches an encoder producing
/// empty or garbage output.
fn verify_avif_container(bytes: &[u8]) -> Result<(), ConversionError> {
    let head = &bytes[..bytes.len().min(64)];
    let has_ftyp_box = head.windows(4).any(|window| window == b"ftyp");
    let has_avif_brand = [&b"avif"[..], b"avis", b"mif1"]
        .iter()
        .any(|brand| head.windows(4).any(|window| window == *brand));

    if has_ftyp_box && has_avif_brand {
        Ok(())
    } else {
        Err(ConversionError::IntegrityCheck)
    }
}

pub(super) fn renamed(
    source_name: &str,
    target_format: OutputFormat,
    name_override: Option<&str>,
) -> String {
    let raw_stem = match name_override {
        Some(stem) => stem.to_string(),
        None => Path::new(source_name)
            .file_stem()
            .and_then(|stem| stem.to_str())
            .unwrap_or("converted")
            .to_string(),
    };
    format!("{}.{}", sanitize_stem(&raw_stem), target_format.extension())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn source(width: u32, height: u32) -> Vec<u8> {
        let image = DynamicImage::ImageRgba8(image::RgbaImage::from_pixel(
            width,
            height,
            image::Rgba([30, 120, 210, 128]),
        ));
        let mut bytes = std::io::Cursor::new(Vec::new());
        image.write_to(&mut bytes, image::ImageFormat::Png).unwrap();
        bytes.into_inner()
    }

    #[test]
    fn every_output_encodes_real_pixels() {
        for name in [
            "PNG", "JPG", "WEBP", "GIF", "BMP", "TIFF", "AVIF", "ICO", "SVG", "QOI", "TGA", "PNM",
            "HDR", "EXR", "FF",
        ] {
            let format = OutputFormat::try_from(name).unwrap();
            let result = convert_to_bytes_with_max_dimension(
                &source(16, 8),
                "photo.png",
                format,
                None,
                None,
            )
            .unwrap_or_else(|e| panic!("{name}: {e}"));
            assert_eq!((result.width, result.height), (16, 8));
            assert_eq!(result.file_name, format!("photo.{}", format.extension()));
            assert!(!result.bytes.is_empty());
            if format != OutputFormat::Avif {
                let decoded = decode_named_source(&result.bytes, &result.file_name).unwrap();
                assert_eq!((decoded.width(), decoded.height()), (16, 8));
            }
        }
    }

    #[test]
    fn resize_and_icon_keep_aspect_ratio_and_do_not_upscale() {
        for (format, max, expected) in [
            (OutputFormat::Png, Some(100), (100, 50)),
            (OutputFormat::Ico, None, (256, 128)),
            (OutputFormat::Png, Some(1000), (600, 300)),
        ] {
            let result = convert_to_bytes_with_max_dimension(
                &source(600, 300),
                "input.png",
                format,
                None,
                max,
            )
            .unwrap();
            assert_eq!((result.width, result.height), expected);
        }
    }

    #[test]
    fn malformed_images_fail_without_output() {
        for source in [b"not an image".as_slice(), b"<svg>", &[]] {
            assert!(convert_to_bytes_with_max_dimension(
                source,
                "fake.png",
                OutputFormat::Png,
                None,
                None
            )
            .is_err());
        }
    }
}
