use image::DynamicImage;

use super::error::ConversionError;

/// Decodes source bytes into an in-memory image, transparently rasterizing
/// SVG first if that's what the source is — everything after this point in
/// the pipeline only ever deals with raster pixels, regardless of what the
/// user dropped in.
pub fn decode_source(bytes: &[u8]) -> Result<DynamicImage, ConversionError> {
    if looks_like_svg(bytes) {
        rasterize_svg(bytes)
    } else {
        image::load_from_memory(bytes).map_err(ConversionError::from)
    }
}

fn looks_like_svg(bytes: &[u8]) -> bool {
    let head = &bytes[..bytes.len().min(1024)];
    let text = String::from_utf8_lossy(head);
    let trimmed = text.trim_start();
    trimmed.starts_with("<?xml") || trimmed.starts_with("<svg") || trimmed.contains("<svg")
}

/// Rasterizes an SVG to a raster `DynamicImage` at its intrinsic size.
///
/// Note: no system fonts are loaded here (that scan is slow and would run
/// on every single conversion), so `<text>` relying on system fonts may
/// render without visible glyphs. Self-contained vector SVGs — icons,
/// logos, illustrations — render correctly.
fn rasterize_svg(bytes: &[u8]) -> Result<DynamicImage, ConversionError> {
    let options = usvg::Options::default();
    let tree = usvg::Tree::from_data(bytes, &options)
        .map_err(|error| ConversionError::Svg(error.to_string()))?;

    let size = tree.size().to_int_size();
    let mut pixmap = tiny_skia::Pixmap::new(size.width(), size.height())
        .ok_or_else(|| ConversionError::Svg("SVG has no visible size".to_string()))?;

    resvg::render(&tree, tiny_skia::Transform::default(), &mut pixmap.as_mut());

    // tiny-skia stores premultiplied alpha; `image`/PNG etc. expect
    // straight alpha, so each pixel needs to be demultiplied on the way
    // out or semi-transparent areas would encode with darkened colors.
    let rgba: Vec<u8> = pixmap
        .pixels()
        .iter()
        .flat_map(|pixel| {
            let straight = pixel.demultiply();
            [
                straight.red(),
                straight.green(),
                straight.blue(),
                straight.alpha(),
            ]
        })
        .collect();

    image::RgbaImage::from_raw(size.width(), size.height(), rgba)
        .map(DynamicImage::ImageRgba8)
        .ok_or_else(|| ConversionError::Svg("couldn't build the rasterized image".to_string()))
}
