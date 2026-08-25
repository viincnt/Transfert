mod error;
mod fields;

pub use error::MetadataError;
pub use fields::MetadataFields;

use std::io::Cursor;
use std::path::Path;
use std::str::FromStr;

use little_exif::exif_tag::ExifTag;
use little_exif::filetype::FileExtension;
use little_exif::metadata::Metadata;

use crate::naming::sanitize_stem;

/// Builds the output file name for a strip/edit result. Format never
/// changes here (unlike the image converter, which picks a new extension),
/// so this just re-applies the source's own extension to whatever stem is
/// in play — same sanitize-on-every-path behavior as
/// `conversion::pipeline::renamed`, so a custom name typed here can't
/// escape the destination folder any more than one typed in the converter.
pub fn renamed(source_name: &str, name_override: Option<&str>) -> String {
    let extension = Path::new(source_name)
        .extension()
        .and_then(|extension| extension.to_str())
        .unwrap_or("");
    let raw_stem = match name_override {
        Some(stem) => stem.to_string(),
        None => Path::new(source_name)
            .file_stem()
            .and_then(|stem| stem.to_str())
            .unwrap_or("file")
            .to_string(),
    };

    if extension.is_empty() {
        sanitize_stem(&raw_stem)
    } else {
        format!("{}.{}", sanitize_stem(&raw_stem), extension)
    }
}

/// Formats little_exif can actually read/write for us. It also claims HEIF
/// and JXL, but this app never decodes those elsewhere (AVIF, the closest
/// thing, only round-trips through a container check — see
/// `conversion::pipeline`), so exposing metadata editing for a format the
/// rest of the app can't otherwise touch would be a dead end. WebP support
/// is further limited to lossless/extended WebP by little_exif itself.
fn is_supported(file_type: FileExtension) -> bool {
    matches!(
        file_type,
        FileExtension::JPEG | FileExtension::PNG { .. } | FileExtension::TIFF | FileExtension::WEBP
    )
}

/// Sniffs the real file type from content first — same reasoning as
/// `conversion::decode`'s SVG sniff: a renamed file shouldn't fool this —
/// and only falls back to the extension if the header isn't recognized.
fn detect_file_type(bytes: &[u8], file_name: &str) -> Result<FileExtension, MetadataError> {
    let mut cursor = Cursor::new(bytes);
    if let Some(detected) = FileExtension::auto_detect(&mut cursor) {
        if is_supported(detected) {
            return Ok(detected);
        }
    }

    let extension = Path::new(file_name)
        .extension()
        .and_then(|extension| extension.to_str())
        .unwrap_or_default();

    FileExtension::from_str(extension)
        .ok()
        .filter(|file_type| is_supported(*file_type))
        .ok_or_else(|| MetadataError::UnsupportedFormat(extension.to_string()))
}

/// Strips every EXIF tag from `bytes` in place — pixels untouched, no
/// re-encode, so unlike a decode/re-encode round trip this can't degrade a
/// lossy format or drop an ICC profile as a side effect of "cleaning" it.
pub fn strip_bytes(mut bytes: Vec<u8>, file_name: &str) -> Result<Vec<u8>, MetadataError> {
    let file_type = detect_file_type(&bytes, file_name)?;
    Metadata::clear_metadata(&mut bytes, file_type)?;
    Ok(bytes)
}

/// Reads the curated fields (see `MetadataFields`) currently set on `bytes`.
pub fn read_fields(bytes: &[u8], file_name: &str) -> Result<MetadataFields, MetadataError> {
    let file_type = detect_file_type(bytes, file_name)?;
    let metadata = Metadata::new_from_vec(&bytes.to_vec(), file_type)?;
    Ok(fields_from(&metadata))
}

/// Applies `fields` on top of whatever `bytes` already has — a field left
/// as `None`/empty removes that tag rather than leaving the old value
/// behind, so the edit form always reflects exactly what gets written.
/// Verifies by re-reading the result back and comparing against what was
/// asked for, the same "trust but verify" the rest of the app applies to
/// every write (see `conversion::pipeline`, `delivery::write_verified`).
pub fn write_fields(
    mut bytes: Vec<u8>,
    file_name: &str,
    fields: &MetadataFields,
) -> Result<Vec<u8>, MetadataError> {
    let file_type = detect_file_type(&bytes, file_name)?;
    let mut metadata =
        Metadata::new_from_vec(&bytes.to_vec(), file_type).unwrap_or_else(|_| Metadata::new());

    apply_tag(&mut metadata, ExifTag::Artist, fields.artist.as_deref());
    apply_tag(
        &mut metadata,
        ExifTag::Copyright,
        fields.copyright.as_deref(),
    );
    apply_tag(
        &mut metadata,
        ExifTag::ImageDescription,
        fields.description.as_deref(),
    );
    apply_tag(
        &mut metadata,
        ExifTag::DateTimeOriginal,
        fields.date_taken.as_deref(),
    );
    apply_tag(&mut metadata, ExifTag::Make, fields.device_make.as_deref());
    apply_tag(
        &mut metadata,
        ExifTag::Model,
        fields.device_model.as_deref(),
    );

    metadata.write_to_vec(&mut bytes, file_type)?;

    let written = read_fields(&bytes, file_name)?;
    let expected = normalized(fields);
    if written.artist != expected.artist
        || written.copyright != expected.copyright
        || written.description != expected.description
        || written.date_taken != expected.date_taken
        || written.device_make != expected.device_make
        || written.device_model != expected.device_model
    {
        return Err(MetadataError::IntegrityCheck);
    }

    Ok(bytes)
}

fn apply_tag(metadata: &mut Metadata, make: impl Fn(String) -> ExifTag, value: Option<&str>) {
    match MetadataFields::normalize(value) {
        Some(value) => metadata.set_tag(make(value)),
        None => {
            metadata.remove_tag(make(String::new()));
        }
    }
}

fn normalized(fields: &MetadataFields) -> MetadataFields {
    MetadataFields {
        artist: MetadataFields::normalize(fields.artist.as_deref()),
        copyright: MetadataFields::normalize(fields.copyright.as_deref()),
        description: MetadataFields::normalize(fields.description.as_deref()),
        date_taken: MetadataFields::normalize(fields.date_taken.as_deref()),
        device_make: MetadataFields::normalize(fields.device_make.as_deref()),
        device_model: MetadataFields::normalize(fields.device_model.as_deref()),
    }
}

fn fields_from(metadata: &Metadata) -> MetadataFields {
    MetadataFields {
        artist: tag_value(metadata, ExifTag::Artist(String::new())),
        copyright: tag_value(metadata, ExifTag::Copyright(String::new())),
        description: tag_value(metadata, ExifTag::ImageDescription(String::new())),
        date_taken: tag_value(metadata, ExifTag::DateTimeOriginal(String::new())),
        device_make: tag_value(metadata, ExifTag::Make(String::new())),
        device_model: tag_value(metadata, ExifTag::Model(String::new())),
    }
}

/// `probe` only exists to carry the variant (and its group) for
/// `Metadata::get_tag` to look up — the value inside it is never read, so
/// an empty string is as good as any other placeholder.
fn tag_value(metadata: &Metadata, probe: ExifTag) -> Option<String> {
    metadata.get_tag(&probe).find_map(|tag| match tag {
        ExifTag::Artist(value)
        | ExifTag::Copyright(value)
        | ExifTag::ImageDescription(value)
        | ExifTag::DateTimeOriginal(value)
        | ExifTag::Make(value)
        | ExifTag::Model(value) => MetadataFields::normalize(Some(value.as_str())),
        _ => None,
    })
}
