use std::collections::HashSet;
use std::io::{Cursor, Write};
use std::path::Path;

use thiserror::Error;
use zip::write::SimpleFileOptions;
use zip::{CompressionMethod, ZipArchive, ZipWriter};

#[derive(Debug, Error)]
pub enum BundleError {
    #[error("zip error: {0}")]
    Zip(#[from] zip::result::ZipError),
    #[error("zip I/O failed: {0}")]
    Io(#[from] std::io::Error),
    #[error("the bundled zip failed its integrity check")]
    IntegrityCheck,
}

pub struct ZipEntry {
    pub file_name: String,
    pub bytes: Vec<u8>,
}

/// Bundles `entries` into a single zip archive, in memory. Entirely
/// format-agnostic — it doesn't know or care whether the bytes are
/// converted images, documents, or anything else, so any future converter
/// can reuse this as-is.
///
/// Before returning, the archive this just built is re-opened and checked
/// — the same "don't trust your own output, verify it" discipline as the
/// image pipeline, applied to the container instead of the pixels.
pub fn build_zip(entries: &[ZipEntry]) -> Result<Vec<u8>, BundleError> {
    let mut buffer = Cursor::new(Vec::new());
    {
        let mut writer = ZipWriter::new(&mut buffer);
        let options = SimpleFileOptions::default().compression_method(CompressionMethod::Deflated);

        let mut used_names: HashSet<String> = HashSet::new();
        for entry in entries {
            let name = unique_zip_name(&mut used_names, &entry.file_name);
            writer.start_file(name, options)?;
            writer.write_all(&entry.bytes)?;
        }
        writer.finish()?;
    }

    let bytes = buffer.into_inner();

    let archive = ZipArchive::new(Cursor::new(&bytes)).map_err(|_| BundleError::IntegrityCheck)?;
    if archive.len() != entries.len() {
        return Err(BundleError::IntegrityCheck);
    }

    Ok(bytes)
}

/// Same idea as `naming::unique_path`, but for names inside an in-memory
/// archive rather than paths on disk (no filesystem to check existence
/// against, so it tracks what's been used in this archive instead).
fn unique_zip_name(used: &mut HashSet<String>, file_name: &str) -> String {
    if used.insert(file_name.to_string()) {
        return file_name.to_string();
    }

    let stem = Path::new(file_name)
        .file_stem()
        .and_then(|stem| stem.to_str())
        .unwrap_or("file");
    let extension = Path::new(file_name)
        .extension()
        .and_then(|extension| extension.to_str())
        .unwrap_or("");

    let mut attempt = 1u32;
    loop {
        let candidate = format!("{stem} ({attempt}).{extension}");
        if used.insert(candidate.clone()) {
            return candidate;
        }
        attempt += 1;
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Read;

    #[test]
    fn duplicate_names_keep_every_file_and_its_contents() {
        let entries: Vec<_> = ["file.txt", "file.txt", "file (1).txt"]
            .into_iter()
            .enumerate()
            .map(|(i, name)| ZipEntry {
                file_name: name.into(),
                bytes: vec![i as u8; 10],
            })
            .collect();
        let bytes = build_zip(&entries).unwrap();
        let mut zip = ZipArchive::new(Cursor::new(bytes)).unwrap();
        let mut names = HashSet::new();
        for (i, entry) in entries.iter().enumerate() {
            let mut file = zip.by_index(i).unwrap();
            assert!(names.insert(file.name().to_owned()));
            let mut actual = Vec::new();
            file.read_to_end(&mut actual).unwrap();
            assert_eq!(actual, entry.bytes);
        }
    }
}
