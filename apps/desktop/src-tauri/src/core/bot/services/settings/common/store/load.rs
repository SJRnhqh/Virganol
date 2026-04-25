// apps/desktop/src-tauri/src/core/bot/services/settings/common/store/load.rs
use tauri::AppHandle;
use tauri_plugin_store::StoreExt;

use super::super::super::super::super::{ProviderError, SETTINGS_FILE};

/// Loads a JSON value by key from settings.json.
///
/// 从 settings.json 按 key 读取一段 JSON 值。
pub(crate) fn load_settings(
    app: &AppHandle,
    key: &str,
) -> Result<Option<serde_json::Value>, ProviderError> {
    let store = app
        .store(SETTINGS_FILE)
        .map_err(|error| ProviderError::Io(format!("open settings store failed: {}", error)))?;
    Ok(store.get(key))
}
