mod bundling;
mod conversion;
mod converters;
mod delivery;
mod metadata;
mod naming;

use std::path::PathBuf;

use conversion::{convert_to_bytes_with_max_dimension, ConvertedImage, OutputFormat};
use metadata::MetadataFields;
use rayon::prelude::*;
use serde::{Deserialize, Serialize};

/// What the frontend gets back for a single delivered file — no
/// format/encoding details, just proof it was produced, verified, and
/// where it landed. Shared by every command that hands a finished file
/// back, regardless of what kind of conversion produced it.
#[derive(Serialize)]
struct DeliveredFileResponse {
    #[serde(rename = "fileName")]
    file_name: String,
    path: String,
    size: u64,
    sha256: String,
}

impl From<delivery::DeliveredFile> for DeliveredFileResponse {
    fn from(file: delivery::DeliveredFile) -> Self {
        Self {
            file_name: file.file_name,
            path: file.path,
            size: file.size,
            sha256: file.sha256,
        }
    }
}

#[derive(Serialize)]
struct ConvertImageResponse {
    #[serde(flatten)]
    delivered: DeliveredFileResponse,
    width: u32,
    height: u32,
}

#[tauri::command]
async fn convert_image_command(
    bytes: Vec<u8>,
    file_name: String,
    target_format: String,
    destination_dir: String,
    name_override: Option<String>,
    max_dimension: Option<u32>,
) -> Result<ConvertImageResponse, String> {
    let format = OutputFormat::try_from(target_format.as_str()).map_err(|e| e.to_string())?;
    let destination_dir = PathBuf::from(destination_dir);

    // Decoding/encoding is synchronous CPU work — run it on a blocking
    // thread so it can't stall the async runtime the IPC bridge runs on.
    tauri::async_runtime::spawn_blocking(move || {
        let converted = convert_to_bytes_with_max_dimension(
            &bytes,
            &file_name,
            format,
            name_override.as_deref(),
            max_dimension,
        )
        .map_err(|e| e.to_string())?;
        let delivered =
            delivery::write_verified(&converted.bytes, &destination_dir, &converted.file_name)
                .map_err(|e| e.to_string())?;

        Ok(ConvertImageResponse {
            width: converted.width,
            height: converted.height,
            delivered: delivered.into(),
        })
    })
    .await
    .map_err(|e| e.to_string())?
}

#[derive(Deserialize)]
struct ZipFileInput {
    id: String,
    bytes: Vec<u8>,
    #[serde(rename = "fileName")]
    file_name: String,
    #[serde(rename = "targetFormat")]
    target_format: String,
    #[serde(rename = "nameOverride")]
    name_override: Option<String>,
    #[serde(rename = "maxDimension")]
    max_dimension: Option<u32>,
}

#[derive(Serialize)]
struct ZipEntryOutcome {
    id: String,
    #[serde(rename = "fileName")]
    file_name: Option<String>,
    error: Option<String>,
}

#[derive(Serialize)]
struct ConvertZipResponse {
    zip: DeliveredFileResponse,
    entries: Vec<ZipEntryOutcome>,
}

#[tauri::command]
async fn convert_images_to_zip_command(
    files: Vec<ZipFileInput>,
    destination_dir: String,
    zip_name: String,
) -> Result<ConvertZipResponse, String> {
    let destination_dir = PathBuf::from(destination_dir);

    tauri::async_runtime::spawn_blocking(move || {
        // Each file's decode/encode is independent CPU work, so this runs
        // across every available core instead of one file at a time —
        // the same parallelism the frontend gets from firing off one
        // `invoke` per file in the non-zip path, just inside one command.
        let results: Vec<(String, Result<ConvertedImage, String>)> = files
            .into_par_iter()
            .map(|file| {
                let outcome = OutputFormat::try_from(file.target_format.as_str())
                    .and_then(|format| {
                        convert_to_bytes_with_max_dimension(
                            &file.bytes,
                            &file.file_name,
                            format,
                            file.name_override.as_deref(),
                            file.max_dimension,
                        )
                    })
                    .map_err(|e| e.to_string());
                (file.id, outcome)
            })
            .collect();

        let mut zip_entries = Vec::new();
        let mut entries = Vec::with_capacity(results.len());

        for (id, result) in results {
            match result {
                Ok(converted) => {
                    entries.push(ZipEntryOutcome {
                        id,
                        file_name: Some(converted.file_name.clone()),
                        error: None,
                    });
                    zip_entries.push(bundling::ZipEntry {
                        file_name: converted.file_name,
                        bytes: converted.bytes,
                    });
                }
                Err(error) => {
                    entries.push(ZipEntryOutcome {
                        id,
                        file_name: None,
                        error: Some(error),
                    });
                }
            }
        }

        if zip_entries.is_empty() {
            return Err("none of the files could be converted".to_string());
        }

        let zip_bytes = bundling::build_zip(&zip_entries).map_err(|e| e.to_string())?;
        let delivered =
            delivery::write_verified(&zip_bytes, &destination_dir, &format!("{zip_name}.zip"))
                .map_err(|e| e.to_string())?;

        Ok(ConvertZipResponse {
            zip: delivered.into(),
            entries,
        })
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
async fn strip_metadata_command(
    bytes: Vec<u8>,
    file_name: String,
    destination_dir: String,
    name_override: Option<String>,
) -> Result<DeliveredFileResponse, String> {
    let destination_dir = PathBuf::from(destination_dir);

    tauri::async_runtime::spawn_blocking(move || {
        let stripped = metadata::strip_bytes(bytes, &file_name).map_err(|e| e.to_string())?;
        let out_name = metadata::renamed(&file_name, name_override.as_deref());
        let delivered = delivery::write_verified(&stripped, &destination_dir, &out_name)
            .map_err(|e| e.to_string())?;

        Ok(delivered.into())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
async fn read_metadata_command(
    bytes: Vec<u8>,
    file_name: String,
) -> Result<MetadataFields, String> {
    tauri::async_runtime::spawn_blocking(move || {
        metadata::read_fields(&bytes, &file_name).map_err(|e| e.to_string())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
async fn write_metadata_command(
    bytes: Vec<u8>,
    file_name: String,
    destination_dir: String,
    fields: MetadataFields,
    name_override: Option<String>,
) -> Result<DeliveredFileResponse, String> {
    let destination_dir = PathBuf::from(destination_dir);

    tauri::async_runtime::spawn_blocking(move || {
        let edited =
            metadata::write_fields(bytes, &file_name, &fields).map_err(|e| e.to_string())?;
        let out_name = metadata::renamed(&file_name, name_override.as_deref());
        let delivered = delivery::write_verified(&edited, &destination_dir, &out_name)
            .map_err(|e| e.to_string())?;

        Ok(delivered.into())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            convert_image_command,
            convert_images_to_zip_command,
            converters::media_runtime_command,
            converters::convert_file_command,
            converters::convert_files_to_zip_command,
            strip_metadata_command,
            read_metadata_command,
            write_metadata_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
