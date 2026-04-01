// apps/desktop/src-tauri/src/core/bot/services/settings/provider/crud.rs
// 外部依赖
use log::{error, info};
use tauri::AppHandle;

// 内部引用
use crate::core::bot::models::{HealthCheckResponse, ProviderId};
use crate::core::models::settings::ProviderRecord;
use crate::core::providers::connections::health;
use crate::core::settings::bot::providers::store::{load_provider_record, save_provider};
use crate::core::settings::bot::providers::utils::compute_enabled_models;
use crate::core::settings::secrets;

/// 接入并持久化：health_check 成功后自动保存配置
/// 返回 HealthCheckResponse（前端根据 success 判断是否接入成功）
pub(crate) async fn connect_and_save(
    app: &AppHandle,
    provider_id: ProviderId,
    key: &str,
    url: &str,
) -> HealthCheckResponse {
    // 1) 先归一化前端传入的 key（去掉首尾空白）
    let normalized_key = key.trim();
    // 无条件记录旧 key 快照，用于后续异常回滚
    let previous_persisted_key = secrets::load_provider_key(provider_id);

    // 2) 密钥解析：若未输入则尝试回退 (env -> keyring)，否则使用当前输入
    let resolved_key_guard = if normalized_key.is_empty() {
        secrets::load_provider_key_from_env(provider_id)
            .or_else(|| secrets::load_provider_key(provider_id))
    } else {
        None
    };

    // 3) 用解析后的密钥执行健康检查
    let result = health::health_check(
        provider_id,
        url,
        resolved_key_guard.as_ref().map(|k| k.as_str()).unwrap_or(normalized_key)
    ).await;

    if result.success {
        if !normalized_key.is_empty() {
            // 决定要保存的 Key：如果是用户显式输入的，由于 health_check 已过，直接存 normalized_key
            if let Err(error_msg) = secrets::save_provider_key(provider_id, normalized_key) {
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
