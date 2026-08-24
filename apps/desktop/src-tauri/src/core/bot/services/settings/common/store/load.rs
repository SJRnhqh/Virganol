// apps/desktop/src-tauri/src/core/bot/services/settings/common/store/load.rs
use serde_json::Value;
use std::sync::Arc;
use tauri::{AppHandle, Wry};
use tauri_plugin_store::{Store, StoreExt};

use super::super::super::super::super::{SettingsError, SettingsStorageContext, SETTINGS_FILE};

/// Loads a JSON value by key from settings.json.
///
/// 按键从设置文件读取配置值。
pub(in crate::core::bot::services::settings) fn load_settings(
    app: &AppHandle,
    ctx: &SettingsStorageContext,
    key: &str,
) -> Result<Option<Value>, SettingsError> {
    let store = open_store(app, ctx)?;
    Ok(store.get(key))
}

/// Opens the settings store.
///
/// 打开设置存储。
pub(super) fn open_store(
    app: &AppHandle,
    ctx: &SettingsStorageContext,
) -> Result<Arc<Store<Wry>>, SettingsError> {
    app.store(SETTINGS_FILE)
        .map_err(|source| SettingsError::store_open(ctx, source))
}
