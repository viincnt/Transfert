mod decode;
mod error;
mod format;
mod pipeline;
mod svg_wrap;

pub use format::OutputFormat;
pub use pipeline::{convert_to_bytes, ConvertedImage};
