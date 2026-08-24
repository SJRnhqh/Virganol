// apps/desktop/src-tauri/src/core/bot/services/settings/common/store/save.rs
use serde_json::Value;
use std::collections::HashMap;
use std::fs::{self, File};
use std::io::Write;
use std::path::{Path, PathBuf};
use tauri::{AppHandle, Manager, Wry};
use tauri_plugin_store::Store;

use super::super::super::super::super::{SettingsError, SettingsStorageContext, SETTINGS_FILE};
use super::open_store;

/// Saves a settings value by key, overwriting existing values.
///
/// 按键写入或更新设置文件中的配置值。
pub(in crate::core::bot::services::settings) fn save_settings(
    app: &AppHandle,
    ctx: &SettingsStorageContext,
    key: &str,
    value: Value,
) -> Result<(), SettingsError> {
    let store = open_store(app, ctx)?;

    store.set(key, value);

    let (store_path, tmp_path) = get_store_paths(app, ctx)?;
    let json_bytes = serialize_store_to_bytes(ctx, &store)?;

    atomic_write(ctx, &store_path, &tmp_path, &json_bytes)?;

    Ok(())
}

/// Resolves the settings file and temporary file paths.
///
/// 获取设置文件路径和临时文件路径。
fn get_store_paths(
    app: &AppHandle,
    ctx: &SettingsStorageContext,
) -> Result<(PathBuf, PathBuf), SettingsError> {
    let store_path = app
        .path()
        .app_data_dir()
        .map_err(|source| SettingsError::store_path(ctx, source))?
        .join(SETTINGS_FILE);

    let tmp_path = store_path.with_file_name(format!("{}.tmp", SETTINGS_FILE));
    Ok((store_path, tmp_path))
}

/// Serializes store entries to JSON bytes.
///
/// 将存储条目序列化为 JSON 字节。
fn serialize_store_to_bytes(
    ctx: &SettingsStorageContext,
    store: &Store<Wry>,
) -> Result<Vec<u8>, SettingsError> {
    let all_data: HashMap<String, Value> = store
        .entries()
        .iter()
        .map(|(k, v)| (k.clone(), v.clone()))
        .collect();

    serde_json::to_vec_pretty(&all_data)
        .map_err(|source| SettingsError::store_serialize(ctx, source))
}

/// Writes bytes atomically via a temporary file and rename.
///
/// 通过临时文件和重命名执行原子写入。
fn atomic_write(
    ctx: &SettingsStorageContext,
    store_path: &Path,
    tmp_path: &Path,
    data: &[u8],
) -> Result<(), SettingsError> {
    {
        let mut file = File::create(tmp_path)
            .map_err(|source| SettingsError::store_temp_create(ctx, source))?;
        file.write_all(data)
            .map_err(|source| SettingsError::store_write(ctx, source))?;
        file.sync_all()
            .map_err(|source| SettingsError::store_sync(ctx, source))?;
    }

    if let Err(source) = fs::rename(tmp_path, store_path) {
        let _ = fs::remove_file(tmp_path);
        return Err(SettingsError::store_replace(ctx, source));
    }

    if let Some(parent) = store_path.parent() {
        if let Ok(dir) = File::open(parent) {
            let _ = dir.sync_all();
        }
    }

    Ok(())
}
