// apps/desktop/src-tauri/src/core/settings/provider.rs

use log::error;
use tauri::AppHandle;
use tauri_plugin_store::StoreExt;

use super::secrets;
use crate::core::models::settings::ProviderRecord;

const STORE_FILE: &str = "settings.json";
const STORE_KEY_SPIRIT_PROVIDERS: &str = "spirit.providers";

/// 读取所有已保存的 providers
/// 返回 HashMap<provider_id_string, ProviderRecord>
pub fn load_all_providers(app: &AppHandle) -> std::collections::HashMap<String, ProviderRecord> {
    let store = match app.store(STORE_FILE) {
        Ok(s) => s,
        Err(_) => return std::collections::HashMap::new(),
    };

    match store.get(STORE_KEY_SPIRIT_PROVIDERS) {
        Some(value) => serde_json::from_value(value.clone()).unwrap_or_default(),
        None => std::collections::HashMap::new(),
    }
}

/// 重置 provider 的持久化配置
pub fn reset_provider_config(app: &AppHandle, provider_id: &str) -> bool {
    let mut providers = load_all_providers(app);
    let existed = providers.remove(provider_id).is_some();
    let key_removed = match secrets::remove_provider_key(provider_id) {
        Ok(()) => true,
        Err(error_msg) => {
            error!("[Tauri] {} key remove failed: {}", provider_id, error_msg);
            false
        }
    };

    if existed {
        if let Ok(store) = app.store(STORE_FILE) {
            store.set(
                STORE_KEY_SPIRIT_PROVIDERS,
                serde_json::to_value(&providers).unwrap_or_default(),
            );
        }
    }

    existed && key_removed
}
