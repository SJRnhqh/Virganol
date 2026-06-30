// apps/desktop/src-tauri/src/core/bot/services/settings/common/store/load.rs
use std::sync::Arc;
use tauri::AppHandle;
use tauri_plugin_store::StoreExt;

use super::super::super::super::super::{SettingsError, SettingsStorageContext, SETTINGS_FILE};

/// Opens the settings store.
///
/// 打开 settings store。
pub(super) fn open_store(
    app: &AppHandle,
    ctx: &SettingsStorageContext,
) -> Result<Arc<tauri_plugin_store::Store<tauri::Wry>>, SettingsError> {
    app.store(SETTINGS_FILE)
        .map_err(|source| SettingsError::store_open(ctx, source))
}

/// Loads a JSON value by key from settings.json.
///
/// 从 settings.json 按 key 读取一段 JSON 值。
pub(in crate::core::bot::services::settings) fn load_settings(
    app: &AppHandle,
    ctx: &SettingsStorageContext,
    key: &str,
) -> Result<Option<serde_json::Value>, SettingsError> {
    let store = open_store(app, ctx)?;
    Ok(store.get(key))
}
