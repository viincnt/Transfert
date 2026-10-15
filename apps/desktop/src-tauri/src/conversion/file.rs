use std::path::Path;

use crate::naming::sanitize_stem;

pub fn normalized(format: &str) -> String {
    match format.to_ascii_lowercase().as_str() {
        "jpeg" | "jpe" => "jpg".into(),
        "tif" => "tiff".into(),
        "htm" => "html".into(),
        "markdown" => "md".into(),
        "wave" => "wav".into(),
        other => other.to_owned(),
    }
}

pub fn source_format(name: &str) -> String {
    normalized(
        Path::new(name)
            .extension()
            .and_then(|ext| ext.to_str())
            .unwrap_or(""),
    )
}

pub fn output_name(source: &str, target: &str, name_override: Option<&str>) -> String {
    let stem = name_override.unwrap_or_else(|| {
        Path::new(source)
            .file_stem()
            .and_then(|stem| stem.to_str())
            .unwrap_or("converted")
    });
    format!("{}.{}", sanitize_stem(stem), target)
}

pub fn convert(
    bytes: &[u8],
    source_name: &str,
    target: &str,
    kind: &str,
    name_override: Option<&str>,
) -> Result<(Vec<u8>, String), String> {
    let source = source_format(source_name);
    let target = normalized(target);
    if source == target {
        return Err("Choose a format different from the source".into());
    }
    let converted = match kind {
        "document" => super::document::convert(bytes, &source, &target)?,
        "audio" | "video" => super::media::convert(bytes, &source, &target, kind)?,
        _ => return Err("Unknown converter".into()),
    };
    Ok((converted, output_name(source_name, &target, name_override)))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn validates_aliases_before_conversion() {
        assert!(convert(b"test", "a.HTM", "HTML", "document", None).is_err());
        assert!(convert(b"test", "a.txt", "../html", "document", None).is_err());
        assert!(convert(b"test", "a.txt", "html", "unknown", None).is_err());
        let (bytes, name) = convert(b"hello", "a.TXT", "HTML", "document", Some("a/b:c")).unwrap();
        assert_eq!(name, "abc.html");
        assert!(bytes.starts_with(b"<!doctype html>"));
    }
}
