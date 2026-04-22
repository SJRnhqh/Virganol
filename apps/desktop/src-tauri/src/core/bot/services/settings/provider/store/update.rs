// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/update.rs
// 外部依赖
use log::warn;
use tauri::AppHandle;

// 内部引用
use super::super::super::super::super::{
    ProviderError, ProviderId, ProviderState, SPIRIT_PROVIDERS_KEY,
};
use super::super::super::save_settings;
use super::load_all_providers;

/// 更新某个 provider 的 enabled_models
/// - Ok(true)：更新成功
/// - Ok(false)：该 provider 不存在
/// - Err(...)：序列化或写盘失败
pub(crate) fn update_models(
    app: &AppHandle,
    provider_state: &ProviderState,
    provider_id: ProviderId,
    enabled_models: Vec<String>,
) -> Result<bool, ProviderError> {
    // 锁住整个"读取 -> 修改 -> 写回"事务，避免并发请求互相覆盖结果
    let _guard = provider_state.store_lock.lock();

    let mut providers = load_all_providers(app)?;

    let Some(record) = providers.get_mut(provider_id.as_str()) else {
        warn!("[Tauri] {} not found, cannot update models", provider_id);
        return Ok(false);
    };

    // 仅更新目标 provider 的 enabled_models，随后整体落盘
    record.enabled_models = enabled_models;

    let value = serde_json::to_value(&providers)?;
    save_settings(app, SPIRIT_PROVIDERS_KEY, value)?;
    Ok(true)
}
