// apps/desktop/src-tauri/src/core/bot/services/settings/provider/manager/reset.rs
// 外部依赖
use log::{error, info};
use tauri::AppHandle;

// 内部引用
use super::super::super::super::super::{ProviderId, ResetProviderResponse};
use super::super::{load_provider_record, remove_provider, remove_provider_key, save_provider};

/// 重置 provider 的持久化配置
pub(crate) fn reset_provider_config(
    app: &AppHandle,
    provider_id: ProviderId,
) -> ResetProviderResponse {
    // 1) 先快照旧配置，供异常时回滚
    let previous_record = match load_provider_record(app, provider_id) {
        Ok(record) => record,
        Err(e) => {
            return ResetProviderResponse {
                success: false,
                error: Some(e.message()),
            };
        }
    };

    // 2) 先删除普通配置（settings.json 中的 spirit.providers.{id}）
    let config_removed = match remove_provider(app, provider_id) {
        Ok(removed) => removed,
        Err(e) => {
            return ResetProviderResponse {
                success: false,
                error: Some(e.message()),
            };
        }
    };

    if !config_removed {
        log::warn!("[Tauri] ⚠️ {} config not found, already clean", provider_id);
        return ResetProviderResponse {
            success: true,
            error: None,
        }; // 幂等：目标状态已达成
    }

    // 3) 再删除系统密钥库中的 key（幂等：不存在也应算成功）
    let (key_removed, key_error) = match remove_provider_key(provider_id) {
        Ok(()) => (true, None),
        Err(e) => (false, Some(e.message())),
    };

    // 4) key 删除失败时，回滚已删除的配置
    if config_removed && !key_removed {
        if let Some(record) = previous_record.as_ref() {
            if let Err(e) = save_provider(app, provider_id, record) {
                error!(
                    "[Tauri] ❌ {} config rollback failed after key remove error: {}",
                    provider_id,
                    e.message()
                );
            } else {
                info!("[Tauri] ↩️ {} config rollback completed", provider_id);
            }
        }
        return ResetProviderResponse {
            success: false,
            error: key_error,
        };
    }

    // 5) 两者都成功
    ResetProviderResponse {
        success: true,
        error: None,
    }
}
