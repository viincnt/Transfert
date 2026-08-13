use std::fmt;

use image::ImageFormat;

use super::error::ConversionError;

/// The image formats Transfert can produce. Keep this in sync with the
/// format lists on the frontend (`src/pages/image-converter.tsx`).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum OutputFormat {
    Png,
    Jpg,
    WebP,
    Gif,
    Bmp,
    Tiff,
    Avif,
    Ico,
    Svg,
}

impl OutputFormat {
    /// `None` for formats that don't go through the `image` crate's own
    /// encoders — currently just SVG, which gets its own code path
    /// (`svg_wrap`) since it isn't a raster format at all.
    pub fn image_format(self) -> Option<ImageFormat> {
        match self {
            Self::Png => Some(ImageFormat::Png),
            Self::Jpg => Some(ImageFormat::Jpeg),
            Self::WebP => Some(ImageFormat::WebP),
            Self::Gif => Some(ImageFormat::Gif),
            Self::Bmp => Some(ImageFormat::Bmp),
            Self::Tiff => Some(ImageFormat::Tiff),
            Self::Avif => Some(ImageFormat::Avif),
            Self::Ico => Some(ImageFormat::Ico),
            Self::Svg => None,
        }
    }

    pub fn extension(self) -> &'static str {
        match self {
            Self::Png => "png",
            Self::Jpg => "jpg",
            Self::WebP => "webp",
            Self::Gif => "gif",
            Self::Bmp => "bmp",
            Self::Tiff => "tiff",
            Self::Avif => "avif",
            Self::Ico => "ico",
            Self::Svg => "svg",
        }
    }
}

impl fmt::Display for OutputFormat {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(self.extension())
    }
}

impl TryFrom<&str> for OutputFormat {
    type Error = ConversionError;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        match value.to_ascii_uppercase().as_str() {
            "PNG" => Ok(Self::Png),
            "JPG" | "JPEG" => Ok(Self::Jpg),
            "WEBP" => Ok(Self::WebP),
            "GIF" => Ok(Self::Gif),
            "BMP" => Ok(Self::Bmp),
            "TIFF" => Ok(Self::Tiff),
            "AVIF" => Ok(Self::Avif),
            "ICO" => Ok(Self::Ico),
            "SVG" => Ok(Self::Svg),
            other => Err(ConversionError::UnsupportedFormat(other.to_string())),
        }
    }
}
