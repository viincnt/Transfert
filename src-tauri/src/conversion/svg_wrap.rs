use std::io::Cursor;

use base64::engine::general_purpose::STANDARD as BASE64;
use base64::Engine;
use image::{DynamicImage, ImageFormat};

use super::error::ConversionError;
use super::format::OutputFormat;
use super::pipeline::{renamed, ConvertedImage};

/// Wraps a raster image inside an SVG document, embedding it as a base64
/// PNG data URI. This is *not* vectorization — the pixels stay exactly as
/// they were, just packaged as a valid, openable SVG file — which is what
/// most "convert to SVG" tools actually do for photographic sources; true
/// tracing (turning pixels into paths) is a different, much heavier
/// feature this doesn't attempt.
pub fn encode(
    image: DynamicImage,
    source_name: &str,
    name_override: Option<&str>,
) -> Result<ConvertedImage, ConversionError> {
    let (width, height) = (image.width(), image.height());

    let mut png_bytes = Vec::new();
    image.write_to(&mut Cursor::new(&mut png_bytes), ImageFormat::Png)?;
    let data_uri = BASE64.encode(&png_bytes);

    let svg = format!(
        "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"{width}\" height=\"{height}\" \
         viewBox=\"0 0 {width} {height}\"><image width=\"{width}\" height=\"{height}\" \
         href=\"data:image/png;base64,{data_uri}\"/></svg>"
    );
    let bytes = svg.into_bytes();

    // Verify by parsing it back with the same SVG reader this app uses
    // for SVG *input* — a genuine round-trip check, unlike the AVIF path
    // where a full decoder isn't available.
    usvg::Tree::from_data(&bytes, &usvg::Options::default())
        .map_err(|error| ConversionError::Svg(error.to_string()))?;

    Ok(ConvertedImage {
        file_name: renamed(source_name, OutputFormat::Svg, name_override),
        width,
        height,
        bytes,
    })
}
