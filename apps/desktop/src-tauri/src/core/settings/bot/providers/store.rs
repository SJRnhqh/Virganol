// apps/desktop/src-tauri/src/core/settings/bot/providers/store.rs
// 外部依赖
use std::collections::HashMap;
use std::sync::Mutex;
use tauri::AppHandle;

// 内部引用
use crate::core::models::provider::ProviderId;
use crate::core::models::settings::ProviderRecord;
use crate::core::settings::store::{load_settings, save_settings};

const STORE_KEY_SPIRIT_PROVIDERS: &str = "spirit.providers";
static PROVIDERS_STORE_LOCK: Mutex<()> = Mutex::new(());

/// 启动检查用的 Provider 加载结果（已完成 provider_id 类型收敛）
pub struct SupportedProvidersSnapshot {
    pub total: usize,
    pub supported: Vec<(ProviderId, ProviderRecord)>,
    pub skipped_raw_ids: Vec<String>,
}

/// 读取所有已保存的 providers
/// 返回 HashMap<provider_id_string, ProviderRecord>
fn load_all_providers(app: &AppHandle) -> HashMap<String, ProviderRecord> {
    load_settings(app, STORE_KEY_SPIRIT_PROVIDERS)
        .and_then(|value| serde_json::from_value(value).ok())
        .unwrap_or_default()
}

/// 读取并过滤为“后端当前支持”的 provider 列表（startup_check 专用）
pub fn load_supported_providers(app: &AppHandle) -> SupportedProvidersSnapshot {
    let providers = load_all_providers(app);
    let total = providers.len();
    let mut supported = Vec::new();
    let mut skipped_raw_ids = Vec::new();

    for (raw_id, record) in providers {
        match ProviderId::try_from(raw_id.as_str()) {
            Ok(provider_id) => supported.push((provider_id, record)),
            Err(_) => skipped_raw_ids.push(raw_id),
        }
    }

    SupportedProvidersSnapshot {
        total,
        supported,
        skipped_raw_ids,
    }
}

/// 读取单个 provider 的配置快照（只读）
/// - Some(record)：存在该 provider 配置
/// - None：不存在该 provider 配置
pub fn load_provider_record(app: &AppHandle, provider_id: ProviderId) -> Option<ProviderRecord> {
    let provider_name = provider_id.as_str();
    load_all_providers(app).get(provider_name).cloned()
}

/// 保存单个 provider 的配置（upsert：有则覆盖，无则新增）
/// 返回 Err 表示序列化或写盘失败。
pub fn save_provider(
    app: &AppHandle,
    provider_id: ProviderId,
    record: &ProviderRecord,
) -> Result<(), String> {
    // 锁住整个“读取 -> 修改 -> 写回”事务，避免并发写入互相覆盖
    let _guard = PROVIDERS_STORE_LOCK
        .lock()
        .map_err(|_| "providers store lock poisoned".to_string())?;

    let provider_name = provider_id.as_str();
    let mut providers = load_all_providers(app);
    providers.insert(provider_name.to_string(), record.clone());

    let value = serde_json::to_value(&providers)
        .map_err(|error| format!("serialize providers failed: {}", error))?;
    save_settings(app, STORE_KEY_SPIRIT_PROVIDERS, value)
}

/// 删除某个 provider 的配置
/// - Ok(true)：删除成功
/// - Ok(false)：该 provider 不存在
/// - Err(...)：序列化或写盘失败
pub fn remove_provider(app: &AppHandle, provider_id: ProviderId) -> Result<bool, String> {
    // 锁住整个“读取 -> 修改 -> 写回”事务，确保删除与其他写操作顺序一致
    let _guard = PROVIDERS_STORE_LOCK
        .lock()
        .map_err(|_| "providers store lock poisoned".to_string())?;

    let provider_name = provider_id.as_str();
    let mut providers = load_all_providers(app);
    let existed = providers.remove(provider_name).is_some();

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
    provider_id: ProviderId,
    enabled_models: Vec<String>,
) -> Result<bool, String> {
    // 锁住整个“读取 -> 修改 -> 写回”事务，避免并发请求互相覆盖结果
    let _guard = PROVIDERS_STORE_LOCK
        .lock()
        .map_err(|_| "providers store lock poisoned".to_string())?;

    let provider_name = provider_id.as_str();
    let mut providers = load_all_providers(app);

    let Some(record) = providers.get_mut(provider_name) else {
        return Ok(false);
    };

    // 仅更新目标 provider 的 enabled_models，随后整体落盘
    record.enabled_models = enabled_models;

    let value = serde_json::to_value(&providers)
        .map_err(|error| format!("serialize providers failed: {}", error))?;
    save_settings(app, STORE_KEY_SPIRIT_PROVIDERS, value)?;
    Ok(true)
}
