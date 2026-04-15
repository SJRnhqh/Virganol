// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/save.rs
// 外部依赖
use tauri::AppHandle;

// 内部引用
use super::super::super::super::super::{
    ProviderError, ProviderId, ProviderRecord, SPIRIT_PROVIDERS_KEY,
};
use super::super::super::save_settings;
use super::{load_all_providers, PROVIDERS_STORE_LOCK};

/// 保存单个 provider 的配置（upsert：有则覆盖，无则新增）
/// 返回 Err 表示序列化或写盘失败。
pub(crate) fn save_provider(
    app: &AppHandle,
    provider_id: ProviderId,
    record: &ProviderRecord,
) -> Result<(), ProviderError> {
    // 锁住整个"读取 -> 修改 -> 写回"事务，避免并发写入互相覆盖
    let _guard = PROVIDERS_STORE_LOCK
        .lock()
        .map_err(|_| ProviderError::Io("providers store lock poisoned".to_string()))?;

    let mut providers = load_all_providers(app)?;
    providers.insert(provider_id.to_string(), record.clone());

    let value = serde_json::to_value(&providers)?;
    save_settings(app, SPIRIT_PROVIDERS_KEY, value)
}
