// apps/desktop/src-tauri/src/core/settings/bot/providers/store.rs
// 外部依赖
use std::collections::HashMap;
use std::sync::Mutex;
use tauri::AppHandle;

// 内部引用
use crate::core::models::settings::ProviderRecord;
use crate::core::settings::store::{load_settings, save_settings};

const STORE_KEY_SPIRIT_PROVIDERS: &str = "spirit.providers";
static PROVIDERS_STORE_LOCK: Mutex<()> = Mutex::new(());

/// 读取所有已保存的 providers
/// 返回 HashMap<provider_id_string, ProviderRecord>
pub fn load_all_providers(app: &AppHandle) -> HashMap<String, ProviderRecord> {
    load_settings(app, STORE_KEY_SPIRIT_PROVIDERS)
        .and_then(|value| serde_json::from_value(value).ok())
        .unwrap_or_default()
}

/// 保存单个 provider 的配置（upsert：有则覆盖，无则新增）
/// 返回 Err 表示序列化或写盘失败。
pub fn save_provider(
    app: &AppHandle,
    provider_id: &str,
    record: &ProviderRecord,
) -> Result<(), String> {
    let mut providers = load_all_providers(app);
    providers.insert(provider_id.to_string(), record.clone());

    let value = serde_json::to_value(&providers)
        .map_err(|error| format!("serialize providers failed: {}", error))?;
    save_settings(app, STORE_KEY_SPIRIT_PROVIDERS, value)
}

/// 删除某个 provider 的配置
/// - Ok(true)：删除成功
/// - Ok(false)：该 provider 不存在
/// - Err(...)：序列化或写盘失败
pub fn remove_provider(app: &AppHandle, provider_id: &str) -> Result<bool, String> {
    let mut providers = load_all_providers(app);
    let existed = providers.remove(provider_id).is_some();

    if !existed {
        return Ok(false);
    }

    let value = serde_json::to_value(&providers)
        .map_err(|error| format!("serialize providers failed: {}", error))?;
    save_settings(app, STORE_KEY_SPIRIT_PROVIDERS, value)?;
    Ok(true)
}

/// 更新某个 provider 的 enabled_models
/// - Ok(true)：更新成功
/// - Ok(false)：该 provider 不存在
/// - Err(...)：序列化或写盘失败
pub fn update_models(
    app: &AppHandle,
    provider_id: &str,
    enabled_models: Vec<String>,
) -> Result<bool, String> {
    // 锁住整个“读取 -> 修改 -> 写回”事务，避免并发请求互相覆盖结果
    let _guard = PROVIDERS_STORE_LOCK
        .lock()
        .map_err(|_| "providers store lock poisoned".to_string())?;

    let mut providers = load_all_providers(app);

    let Some(record) = providers.get_mut(provider_id) else {
        return Ok(false);
    };

    // 仅更新目标 provider 的 enabled_models，随后整体落盘
    record.enabled_models = enabled_models;

    let value = serde_json::to_value(&providers)
        .map_err(|error| format!("serialize providers failed: {}", error))?;
    save_settings(app, STORE_KEY_SPIRIT_PROVIDERS, value)?;
    Ok(true)
}
