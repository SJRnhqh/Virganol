// apps/desktop/src-tauri/src/core/settings/bot/providers/service.rs
// 外部依赖
use log::{error, info};
use tauri::AppHandle;

// 内部引用
use super::store::{load_provider_record, remove_provider, save_provider, update_models};
use super::utils::compute_enabled_models;
use crate::core::models::provider::ProviderId;
use crate::core::models::settings::{HealthCheckResponse, ProviderRecord};
use crate::core::providers::connections::health;
use crate::core::settings::secrets;

// === 交互流程：响应前端LLM供应商与模型CRUD === //
/// 接入并持久化：health_check 成功后自动保存配置
/// 返回 HealthCheckResponse（前端根据 success 判断是否接入成功）
pub async fn connect_and_save(
    app: &AppHandle,
    provider_id: ProviderId,
    url: &str,
    key: &str,
) -> HealthCheckResponse {
    // 1) 先归一化前端传入的 key（去掉首尾空白）
    let normalized_key = key.trim();
    // 若本次输入了新 key，先记录旧 key 快照，用于后续异常回滚
    let previous_persisted_key = if normalized_key.is_empty() {
        None
    } else {
        secrets::load_provider_key(provider_id)
    };

    // 2) 若本次未输入 key，则尝试回退：env -> keyring
    // 前端输入 > env > keyring
    let fallback_key = if normalized_key.is_empty() {
        secrets::load_provider_key_from_env(provider_id)
            .or_else(|| secrets::load_provider_key(provider_id))
    } else {
        None
    };
    // 3) 最终用于健康检查的 key：优先 fallback，其次当前输入（可能为空）
    let key_for_check = fallback_key
        .as_ref()
        .map(|resolved| resolved.as_str())
        .unwrap_or(normalized_key);
    // 4) 用解析后的 key 执行健康检查
    let result = health::health_check(provider_id, url, key_for_check).await;

    if result.success {
        if !normalized_key.is_empty() {
            if let Err(error_msg) = secrets::save_provider_key(provider_id, key_for_check) {
                error!(
                    "[Tauri] ❌ {} key persist failed: {}",
                    provider_id, error_msg
                );
                return HealthCheckResponse::fail("Failed to persist provider key");
            }
        } else {
            info!(
                "[Tauri] ⏭️ {} skip key persist: using env or existing key",
                provider_id
            );
        }

        // 复用历史启用状态，并与本次可用模型做交集对齐
        let previous_record = load_provider_record(app, provider_id);
        let next_enabled_models = match previous_record {
            Some(record) => {
                compute_enabled_models(&record.enabled_models, &result.available_models)
            }
            None => result.available_models.clone(),
        };

        // 健康检查通过，持久化写入配置
        let trimmed_url = url.trim();
        let record = ProviderRecord {
            url: if trimmed_url.is_empty() {
                None
            } else {
                Some(trimmed_url.to_string())
            },
            enabled_models: next_enabled_models,
        };
        if let Err(error_msg) = save_provider(app, provider_id, &record) {
            error!(
                "[Tauri] ❌ {} provider config persist failed: {}",
                provider_id, error_msg
            );

            // 仅当本次显式输入了 key 时，才需要回滚 keyring 变更
            if !normalized_key.is_empty() {
                let rollback_result = if let Some(previous_key) = previous_persisted_key.as_ref() {
                    // 回滚 keyring 旧密钥
                    secrets::save_provider_key(provider_id, previous_key.as_str())
                } else {
                    // 删除新添加密钥
                    secrets::remove_provider_key(provider_id)
                };

                if let Err(rollback_error) = rollback_result {
                    error!(
                        "[Tauri] ❌ {} key rollback failed after config persist error: {}",
                        provider_id, rollback_error
                    );
                } else {
                    info!("[Tauri] ↩️ {} key rollback completed", provider_id);
                }
            }

            return HealthCheckResponse::fail("Failed to persist provider config");
        }

        info!("[Tauri] 💾 {} saved to store", provider_id);
    }

    result
}

/// 重置 provider 的持久化配置
pub fn reset_provider_config(app: &AppHandle, provider_id: ProviderId) -> bool {
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
pub fn update_provider_enabled_models(
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
