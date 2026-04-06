// apps/desktop/src-tauri/src/core/bot/services/settings/provider/manager/connect.rs
// 外部依赖
use log::{error, info};
use tauri::AppHandle;

// 内部引用
use super::super::{
    health_check, load_provider_key, load_provider_key_from_env, load_provider_record,
    remove_provider_key, save_provider, save_provider_key,
};
use crate::core::bot::helpers::compute_enabled_models;
use crate::core::bot::models::{HealthCheckResponse, ProviderId, ProviderRecord};

/// 接入并持久化：health_check 成功后自动保存配置
/// 返回 HealthCheckResponse（前端根据 success 判断是否接入成功）
pub(crate) async fn connect_and_save(
    app: &AppHandle,
    provider_id: ProviderId,
    key: &str,
    url: &str,
) -> HealthCheckResponse {
    // 1) 归一化前端传入的 key 和 url（去掉首尾空白）
    let normalized_key = key.trim();
    let normalized_url = url.trim();
    // 用户显式输入了 key 时，记录旧 key 快照用于后续异常回滚
    let previous_persisted_key = if !normalized_key.is_empty() {
        load_provider_key(provider_id)
    } else {
        None
    };

    // 2) 密钥解析：若未输入则尝试回退 (env -> keyring)，否则使用当前输入
    let resolved_key_guard = if normalized_key.is_empty() {
        load_provider_key_from_env(provider_id).or_else(|| load_provider_key(provider_id))
    } else {
        None
    };

    // 3) 用解析后的密钥执行健康检查
    let result = health_check(
        provider_id,
        normalized_url,
        resolved_key_guard
            .as_ref()
            .map(|k| k.as_str())
            .unwrap_or(normalized_key),
    )
    .await;

    // 健康检查失败，直接返回
    if !result.success {
        return result;
    }

    // 4) 持久化密钥（仅用户显式输入时）
    if !normalized_key.is_empty() {
        // 用户显式输入的 key 已通过健康检查，持久化到 keyring
        if let Err(e) = save_provider_key(provider_id, normalized_key) {
            return HealthCheckResponse::fail(e.message());
        }
    } else {
        // 用户未显式输入 key：来源可能是 env / keyring / 无需密钥，均无需持久化
        info!(
            "[Tauri] ⏭️ {} skip key persist: no user-supplied key",
            provider_id
        );
    }

    // 5) 复用历史启用状态，并与本次可用模型做交集对齐
    let previous_record = match load_provider_record(app, provider_id) {
        Ok(record) => record,
        Err(e) => {
            // TODO: 结构性错误应与健康检查失败区分，考虑扩展 HealthCheckResponse
            // 添加 error_code 字段，让前端能识别 io_error/serde_error 等系统级错误
            return HealthCheckResponse::fail(e.message());
        }
    };
    let next_enabled_models = match previous_record {
        Some(record) => {
            // 重连：保留用户偏好，仅保留交集（已启用且仍可用的模型）
            compute_enabled_models(&record.enabled_models, &result.available_models)
        }
        None => {
            // 首次连接：不自动启用任何模型，等待用户显式选择
            vec![]
        }
    };

    // 6) 持久化写入配置
    let record = ProviderRecord {
        url: if normalized_url.is_empty() {
            None
        } else {
            Some(normalized_url.to_string())
        },
        enabled_models: next_enabled_models,
    };

    if let Err(e) = save_provider(app, provider_id, &record) {
        // 仅当本次显式输入了 key 时，才需要回滚 keyring 变更
        if !normalized_key.is_empty() {
            let rollback_result = if let Some(previous_key) = previous_persisted_key.as_ref() {
                // 回滚 keyring 旧密钥
                save_provider_key(provider_id, previous_key.as_str())
            } else {
                // 删除新添加密钥
                remove_provider_key(provider_id)
            };

            // 回滚失败不影响主错误返回，仅记录 error 日志供运维排查 keyring 状态不一致问题
            if let Err(re) = rollback_result {
                error!(
                    "[Tauri] ❌ {} key rollback failed after config persist error: {}",
                    provider_id, re
                );
            } else {
                info!("[Tauri] ↩️ {} key rollback completed", provider_id);
            }
        }

        // TODO: 结构性错误应与健康检查失败区分，考虑扩展 HealthCheckResponse
        // 添加 error_code 字段，让前端能识别 io_error/serde_error 等系统级错误
        return HealthCheckResponse::fail(e.message());
    }
    result
}
