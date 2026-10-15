use std::path::PathBuf;

use crate::{
    bundling, conversion, delivery, ConvertZipResponse, DeliveredFileResponse, ZipEntryOutcome,
    ZipFileInput,
};

#[tauri::command]
pub async fn media_runtime_command() -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(conversion::media::runtime_status)
        .await
        .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn convert_file_command(
    bytes: Vec<u8>,
    file_name: String,
    target_format: String,
    kind: String,
    destination_dir: String,
    name_override: Option<String>,
) -> Result<DeliveredFileResponse, String> {
    tauri::async_runtime::spawn_blocking(move || {
        let (bytes, name) = conversion::file::convert(
            &bytes,
            &file_name,
            &target_format,
            &kind,
            name_override.as_deref(),
        )?;
        delivery::write_verified(&bytes, &PathBuf::from(destination_dir), &name)
            .map(Into::into)
            .map_err(|e| e.to_string())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn convert_files_to_zip_command(
    files: Vec<ZipFileInput>,
    kind: String,
    destination_dir: String,
    zip_name: String,
) -> Result<ConvertZipResponse, String> {
    tauri::async_runtime::spawn_blocking(move || {
        let mut entries = Vec::new();
        let mut archive = Vec::new();
        // Native encoders already use multiple threads. Keep jobs sequential
        // here to avoid multiplying decoder memory usage across the batch.
        for file in files {
            match conversion::file::convert(
                &file.bytes,
                &file.file_name,
                &file.target_format,
                &kind,
                file.name_override.as_deref(),
            ) {
                Ok((bytes, file_name)) => {
                    entries.push(ZipEntryOutcome {
                        id: file.id,
                        file_name: Some(file_name.clone()),
                        error: None,
                    });
                    archive.push(bundling::ZipEntry { file_name, bytes });
                }
                Err(error) => entries.push(ZipEntryOutcome {
                    id: file.id,
                    file_name: None,
                    error: Some(error),
                }),
            }
        }
        if archive.is_empty() {
            return Err("None of the files could be converted".into());
        }
        let bytes = bundling::build_zip(&archive).map_err(|e| e.to_string())?;
        let name = format!("{}.zip", crate::naming::sanitize_stem(&zip_name));
        let zip = delivery::write_verified(&bytes, &PathBuf::from(destination_dir), &name)
            .map_err(|e| e.to_string())?
            .into();
        Ok(ConvertZipResponse { zip, entries })
    })
    .await
    .map_err(|e| e.to_string())?
}
