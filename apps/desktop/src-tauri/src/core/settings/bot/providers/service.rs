// apps/desktop/src-tauri/src/core/settings/bot/providers/service.rs
// 外部依赖
use log::{error, info};
use tauri::AppHandle;

// 内部引用
use crate::core::bot::models::provider::ProviderId;
use crate::core::bot::services::{
    load_provider_record, remove_provider, save_provider, update_models,
};
use crate::core::settings::secrets;

// === 交互流程：响应前端LLM供应商与模型CRUD === //

/// 重置 provider 的持久化配置
pub(crate) fn reset_provider_config(app: &AppHandle, provider_id: ProviderId) -> bool {
    // 1) 先快照旧配置，供异常时回滚
    let previous_record = load_provider_record(app, provider_id);

    // 2) 先删除普通配置（settings.json 中的 spirit.providers.{id}）
    let config_removed = match remove_provider(app, provider_id) {
        Ok(removed) => removed,
        Err(error_msg) => {
            error!(
                "[Tauri] ❌ {} config remove persist failed: {}",
                provider_id, error_msg
            );
            return false;
        }
    };

    if !config_removed {
        error!("[Tauri] ❌ {} not found, cannot reset config", provider_id);
    }

    // 3) 再删除系统密钥库中的 key（幂等：不存在也应算成功）
    let key_removed = match secrets::remove_provider_key(provider_id) {
        Ok(()) => true,
        Err(error_msg) => {
            error!(
                "[Tauri] ❌ {} key remove failed: {}",
                provider_id, error_msg
            );
            false
        }
    };

    // 4) key 删除失败时，回滚已删除的配置
    if config_removed && !key_removed {
        if let Some(record) = previous_record.as_ref() {
            if let Err(error_msg) = save_provider(app, provider_id, record) {
                error!(
                    "[Tauri] ❌ {} config rollback failed after key remove error: {}",
                    provider_id, error_msg
                );
            } else {
                info!("[Tauri] ↩️ {} config rollback completed", provider_id);
            }
        }
    }

    // 5) 两者都成功才返回 true
    config_removed && key_removed
}

/// 更新某个 provider 的 enabled_models（service 层：负责业务日志）
pub(crate) fn update_provider_enabled_models(
    app: &AppHandle,
    provider_id: ProviderId,
    enabled_models: Vec<String>,
) -> bool {
    // 调用 store 层执行实际写入，并在这里统一记录业务结果与持久化错误
    let ok = match update_models(app, provider_id, enabled_models) {
        Ok(updated) => updated,
        Err(error_msg) => {
            error!(
                "[Tauri] ❌ {} enabled_models persist failed: {}",
                provider_id, error_msg
            );
            return false;
        }
    };

    if ok {
        info!("[Tauri] ✅ {} enabled_models updated", provider_id);
    } else {
        error!("[Tauri] ❌ {} not found, cannot update models", provider_id);
    }

    ok
}
