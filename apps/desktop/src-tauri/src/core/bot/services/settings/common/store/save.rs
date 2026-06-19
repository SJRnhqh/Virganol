// apps/desktop/src-tauri/src/core/bot/services/settings/common/store/save.rs
use std::fs::{self, File};
use std::io::Write;
use std::path::{Path, PathBuf};
use tauri::{AppHandle, Manager};

use super::super::super::super::super::{ProviderError, ProviderId, SETTINGS_FILE};
use super::open_store;

/// Gets store file path and temporary file path.
///
/// 获取 store 文件路径和临时文件路径。
fn get_store_paths(
    app: &AppHandle,
    provider_id: ProviderId,
) -> Result<(PathBuf, PathBuf), ProviderError> {
    let store_path = app
        .path()
        .app_data_dir()
        .map_err(|source| ProviderError::ConfigStorePath {
            provider_id,
            source,
        })?
        .join(SETTINGS_FILE);

    let tmp_path = store_path.with_file_name(format!("{}.tmp", SETTINGS_FILE));
    Ok((store_path, tmp_path))
}

/// Serializes store entries to JSON bytes.
///
/// 将 store 条目序列化为 JSON 字节。
fn serialize_store_to_bytes(
    store: &tauri_plugin_store::Store<tauri::Wry>,
    provider_id: ProviderId,
) -> Result<Vec<u8>, ProviderError> {
    let all_data: std::collections::HashMap<String, serde_json::Value> = store
        .entries()
        .iter()
        .map(|(k, v)| (k.clone(), v.clone()))
        .collect();

    serde_json::to_vec_pretty(&all_data).map_err(|source| ProviderError::ConfigStoreSerialize {
        provider_id,
        source,
    })
}

/// Performs atomic write using temp file + rename strategy.
///
/// 使用临时文件 + rename 策略执行原子写入。
fn atomic_write(
    store_path: &Path,
    tmp_path: &Path,
    data: &[u8],
    provider_id: ProviderId,
) -> Result<(), ProviderError> {
    {
        let mut file =
            File::create(tmp_path).map_err(|source| ProviderError::ConfigStoreTempCreate {
                provider_id,
                source,
            })?;
        file.write_all(data)
            .map_err(|source| ProviderError::ConfigStoreWrite {
                provider_id,
                source,
            })?;
        file.sync_all()
            .map_err(|source| ProviderError::ConfigStoreSync {
                provider_id,
                source,
            })?;
    }

    if let Err(source) = fs::rename(tmp_path, store_path) {
        let _ = fs::remove_file(tmp_path);
        return Err(ProviderError::ConfigStoreReplace {
            provider_id,
            source,
        });
    }

    if let Some(parent) = store_path.parent() {
        if let Ok(dir) = File::open(parent) {
            let _ = dir.sync_all();
        }
    }

    Ok(())
}

/// Saves a JSON value to settings.json by key (upsert semantics).
///
/// 将 JSON 值写入 settings.json 的指定 key（upsert 语义）。
pub(in crate::core::bot::services::settings) fn save_settings(
    app: &AppHandle,
    key: &str,
    value: serde_json::Value,
    provider_id: ProviderId,
) -> Result<(), ProviderError> {
    let store = open_store(app, Some(provider_id))?;

    store.set(key, value);

    let (store_path, tmp_path) = get_store_paths(app, provider_id)?;
    let json_bytes = serialize_store_to_bytes(&store, provider_id)?;

    atomic_write(&store_path, &tmp_path, &json_bytes, provider_id)?;

    Ok(())
}
