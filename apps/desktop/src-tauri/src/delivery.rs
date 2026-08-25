use std::fs;
use std::path::Path;

use sha2::{Digest, Sha256};
use thiserror::Error;

use crate::naming::unique_path;

#[derive(Debug, Error)]
pub enum DeliveryError {
    #[error("file I/O failed: {0}")]
    Io(#[from] std::io::Error),
    #[error("the file failed its integrity check after being written")]
    IntegrityCheck,
}

pub struct DeliveredFile {
    pub file_name: String,
    pub path: String,
    pub size: u64,
    pub sha256: String,
}

/// Writes `bytes` into `destination_dir`, never overwriting an existing
/// file (see `naming::unique_path`), then re-reads what actually landed on
/// disk and re-hashes it before telling the caller it succeeded — if the
/// write got corrupted in transit, this catches it and deletes the bad
/// file instead of leaving it for the user to find.
///
/// Format-agnostic on purpose: this is the same "verify what you actually
/// wrote" step whether `bytes` is a converted image, a bundled zip, or
/// (eventually) a converted document/audio/video file.
pub fn write_verified(
    bytes: &[u8],
    destination_dir: &Path,
    file_name: &str,
) -> Result<DeliveredFile, DeliveryError> {
    fs::create_dir_all(destination_dir)?;
    let final_path = unique_path(destination_dir, file_name);
    let expected_hash = hash(bytes);

    fs::write(&final_path, bytes)?;

    let written = fs::read(&final_path)?;
    if hash(&written) != expected_hash {
        let _ = fs::remove_file(&final_path);
        return Err(DeliveryError::IntegrityCheck);
    }

    Ok(DeliveredFile {
        file_name: final_path
            .file_name()
            .and_then(|name| name.to_str())
            .unwrap_or_default()
            .to_string(),
        path: final_path.display().to_string(),
        size: written.len() as u64,
        sha256: expected_hash,
    })
}

pub fn hash(bytes: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(bytes);
    format!("{:x}", hasher.finalize())
}
