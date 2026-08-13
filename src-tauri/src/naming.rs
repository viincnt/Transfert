use std::path::{Path, PathBuf};

/// Strips characters that are invalid in Windows/macOS/Linux file names,
/// plus path separators — so a name built from arbitrary input (a custom
/// naming pattern the user typed, a source file's own name, ...) can never
/// escape the directory it's meant to land in or fail to write on Windows.
pub fn sanitize_stem(stem: &str) -> String {
    let cleaned: String = stem
        .chars()
        .filter(|c| {
            !matches!(c, '<' | '>' | ':' | '"' | '/' | '\\' | '|' | '?' | '*') && !c.is_control()
        })
        .collect();

    let trimmed = cleaned.trim();
    if trimmed.is_empty() {
        "converted".to_string()
    } else {
        trimmed.to_string()
    }
}

/// Never overwrites an existing file: "photo.png" becomes "photo (1).png",
/// "photo (2).png", and so on until a free name is found. Used for both
/// real filesystem destinations and, with a bit of adaptation, in-archive
/// names (see `bundling::build_zip`).
pub fn unique_path(dir: &Path, file_name: &str) -> PathBuf {
    let candidate = dir.join(file_name);
    if !candidate.exists() {
        return candidate;
    }

    let stem = Path::new(file_name)
        .file_stem()
        .and_then(|stem| stem.to_str())
        .unwrap_or("converted");
    let extension = Path::new(file_name)
        .extension()
        .and_then(|extension| extension.to_str())
        .unwrap_or("");

    let mut attempt = 1u32;
    loop {
        let candidate = dir.join(format!("{stem} ({attempt}).{extension}"));
        if !candidate.exists() {
            return candidate;
        }
        attempt += 1;
    }
}
