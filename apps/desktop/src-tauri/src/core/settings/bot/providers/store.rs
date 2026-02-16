// apps/desktop/src-tauri/src/core/settings/bot/providers/store.rs
// 外部依赖
use std::collections::HashMap;
use tauri::AppHandle;
// 内部引用
use crate::core::models::settings::ProviderRecord;
use crate::core::settings::store::{load_settings, save_settings};

const STORE_KEY_SPIRIT_PROVIDERS: &str = "spirit.providers";

/// 读取所有已保存的 providers
/// 返回 HashMap<provider_id_string, ProviderRecord>
pub fn load_all_providers(app: &AppHandle) -> HashMap<String, ProviderRecord> {
    load_settings(app, STORE_KEY_SPIRIT_PROVIDERS)
        .and_then(|value| serde_json::from_value(value).ok())
        .unwrap_or_default()
}

/// 保存单个 provider 的配置（upsert：有则覆盖，无则新增）
/// TODO(provider-persistence): 返回 `Result` 并上抛写盘错误，为 connect/save 的原子化回滚提供基础。
pub fn save_provider(app: &AppHandle, provider_id: &str, record: &ProviderRecord) {
    let mut providers = load_all_providers(app);
    providers.insert(provider_id.to_string(), record.clone());

    save_settings(
        app,
        STORE_KEY_SPIRIT_PROVIDERS,
        serde_json::to_value(&providers).unwrap_or_default(),
    );
}

/// 更新某个 provider 的 enabled_models
/// 返回 true 表示更新成功，false 表示该 provider 不存在
pub fn update_models(app: &AppHandle, provider_id: &str, enabled_models: Vec<String>) -> bool {
    let mut providers = load_all_providers(app);

    let Some(record) = providers.get_mut(provider_id) else {
        return false;
    };

    record.enabled_models = enabled_models;

    save_settings(
        app,
        STORE_KEY_SPIRIT_PROVIDERS,
        serde_json::to_value(&providers).unwrap_or_default(),
    );

    true
}
