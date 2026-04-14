// apps/desktop/src-tauri/src/core/bot/services/settings/provider/store/remove.rs
// 外部依赖
use tauri::AppHandle;

// 内部引用
use super::super::super::save_settings;
use super::{load_all_providers, PROVIDERS_STORE_LOCK};
use crate::core::bot::constants::SPIRIT_PROVIDERS_KEY;
use crate::core::bot::models::{ProviderError, ProviderId};

/// 删除某个 provider 的配置
/// - Ok(true)：删除成功
/// - Ok(false)：该 provider 不存在
/// - Err(...)：序列化或写盘失败
pub(crate) fn remove_provider(
    app: &AppHandle,
    provider_id: ProviderId,
) -> Result<bool, ProviderError> {
    // 锁住整个"读取 -> 修改 -> 写回"事务，确保删除与其他写操作顺序一致
    let _guard = PROVIDERS_STORE_LOCK
        .lock()
        .map_err(|_| ProviderError::Io("providers store lock poisoned".to_string()))?;

    let mut providers = load_all_providers(app)?;
    let existed = providers.remove(provider_id.as_str()).is_some();

    if !existed {
        return Ok(false);
    }

    let value = serde_json::to_value(&providers)?;
    save_settings(app, SPIRIT_PROVIDERS_KEY, value)?;
    Ok(true)
}
