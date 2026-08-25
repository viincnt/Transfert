use thiserror::Error;

#[derive(Debug, Error)]
pub enum MetadataError {
    #[error("\"{0}\" isn't a format Transfert can read or edit metadata for")]
    UnsupportedFormat(String),

    #[error("metadata read/write failed: {0}")]
    Io(#[from] std::io::Error),

    #[error("the edited metadata failed its integrity check")]
    IntegrityCheck,
}
