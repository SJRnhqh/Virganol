// apps/desktop/src-tauri/src/core/bot/services/settings/common/store/load.rs
use std::sync::Arc;
use tauri::AppHandle;
use tauri_plugin_store::StoreExt;

use super::super::super::super::super::{
    ProviderError, ProviderId, SettingsProcessContext, SETTINGS_FILE,
};

/// Opens the settings store.
///
/// 打开 settings store。
pub(super) fn open_store(
    app: &AppHandle,
    _ctx: &SettingsProcessContext,
    provider_id: Option<ProviderId>,
) -> Result<Arc<tauri_plugin_store::Store<tauri::Wry>>, ProviderError> {
    app.store(SETTINGS_FILE)
        .map_err(|source| ProviderError::ConfigStoreOpen {
            provider_id,
            source,
        })
}

/// Loads a JSON value by key from settings.json.
///
/// 从 settings.json 按 key 读取一段 JSON 值。
pub(in crate::core::bot::services::settings) fn load_settings(
    app: &AppHandle,
    ctx: &SettingsProcessContext,
    key: &str,
    provider_id: Option<ProviderId>,
) -> Result<Option<serde_json::Value>, ProviderError> {
    let store = open_store(app, ctx, provider_id)?;
    Ok(store.get(key))
}
