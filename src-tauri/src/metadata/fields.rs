use serde::{Deserialize, Serialize};

/// The curated set of EXIF tags Edit Metadata exposes — the handful of
/// fields people actually go looking for (who took it, who owns it, what
/// it's of, when), not a raw dump of every IFD entry little_exif knows how
/// to parse. `None`/empty means "no value" — reading reports it as such,
/// and writing removes the tag entirely rather than writing an empty string.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct MetadataFields {
    pub artist: Option<String>,
    pub copyright: Option<String>,
    pub description: Option<String>,
    #[serde(rename = "dateTaken")]
    pub date_taken: Option<String>,
    #[serde(rename = "deviceMake")]
    pub device_make: Option<String>,
    #[serde(rename = "deviceModel")]
    pub device_model: Option<String>,
}

impl MetadataFields {
    /// Normalizes a raw field for comparison/storage: trims whitespace and
    /// collapses an empty string to `None`, so "the user cleared the box"
    /// and "the tag was never set" look identical everywhere downstream.
    pub fn normalize(value: Option<&str>) -> Option<String> {
        value
            .map(str::trim)
            .filter(|value| !value.is_empty())
            .map(str::to_string)
    }
}
