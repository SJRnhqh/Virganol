// apps/desktop/src-tauri/src/core/settings/bot/providers/store.rs
// 外部依赖
use tauri::AppHandle;
use tauri_plugin_store::StoreExt;
// 内部引用
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

/// 保存单个 provider 的配置（upsert：有则覆盖，无则新增）
/// TODO(provider-persistence): 返回 `Result` 并上抛写盘错误，为 connect/save 的原子化回滚提供基础。
pub fn save_provider(app: &AppHandle, provider_id: &str, record: &ProviderRecord) {
    let mut providers = load_all_providers(app);
    providers.insert(provider_id.to_string(), record.clone());

    if let Ok(store) = app.store(STORE_FILE) {
        store.set(
            STORE_KEY_SPIRIT_PROVIDERS,
            serde_json::to_value(&providers).unwrap_or_default(),
        );
    }
}
