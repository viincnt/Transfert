use thiserror::Error;

#[derive(Debug, Error)]
pub enum ConversionError {
    #[error("\"{0}\" isn't a format Transfert can produce")]
    UnsupportedFormat(String),

    #[error("image codec error: {0}")]
    Codec(#[from] image::ImageError),

    #[error("couldn't read this SVG: {0}")]
    Svg(String),

    #[error("temp file I/O failed: {0}")]
    Io(#[from] std::io::Error),

    #[error("the converted file failed its integrity check")]
    IntegrityCheck,
}
