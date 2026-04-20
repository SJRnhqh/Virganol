// apps/desktop/src-tauri/src/core/bot/services/settings/provider/manager/connect.rs
// 外部依赖
use log::{error, info};
use tauri::AppHandle;

// 内部引用
use super::super::super::super::super::{
    compute_enabled_models, reorder_enabled_models, ConnectAndSaveProviderResponse, ProviderId,
    ProviderKey, ProviderRecord,
};
use super::super::{
    health_check, load_provider_env, load_provider_key, load_provider_record, remove_provider_key,
    save_provider, save_provider_key,
};

/// 回滚密钥：恢复旧密钥或删除新密钥
///
/// 当配置持久化失败时，需要回滚 keyring 中的密钥变更以保持状态一致性。
/// 回滚前做 CAS 校验：若当前 keyring 值不等于本次写入的 `expected_current`，
/// 说明已被并发 reset/connect 覆盖，回滚只会误伤他人修改，直接跳过。
/// 回滚失败不影响主错误返回，仅记录 error 日志供运维排查。
fn rollback_provider_key(
    provider_id: ProviderId,
    previous_key: Option<&str>,
    expected_current: &str,
) {
    // CAS 校验：keyring 被他人覆盖时跳过回滚
    let current = load_provider_key(provider_id);
    if current.as_ref().map(|k| k.as_str()) != Some(expected_current) {
        info!(
            "[Tauri] ↩️ {} key rollback skipped: concurrent modification detected",
            provider_id
        );
        return;
    }

    let rollback_result = if let Some(key) = previous_key {
        // 恢复旧密钥
        save_provider_key(provider_id, key)
    } else {
        // 删除新添加的密钥
        remove_provider_key(provider_id)
    };

    if let Err(e) = rollback_result {
        error!("[Tauri] ❌ {} key rollback failed: {}", provider_id, e);
    } else {
        info!("[Tauri] ↩️ {} key rollback completed", provider_id);
    }
}

/// 当输入 key 为空时，尝试从环境变量或 keyring 加载已存储的 key
fn try_load_stored_key(provider_id: ProviderId, input_key: &str) -> Option<ProviderKey> {
    if input_key.is_empty() {
        load_provider_env(provider_id).or_else(|| load_provider_key(provider_id))
    } else {
        None
    }
}

/// 接入并持久化：health_check 成功后自动保存配置
/// 返回 ConnectAndSaveProviderResponse（包含 available_models 和 enabled_models）
pub(crate) async fn connect_and_save(
    app: &AppHandle,
    provider_id: ProviderId,
    key: &str,
    url: &str,
) -> ConnectAndSaveProviderResponse {
    // 1) 归一化前端传入的 key 和 url（去掉首尾空白）
    let normalized_key = key.trim();
    let normalized_url = url.trim();

    // 2) 密钥解析：若未输入则尝试回退 (env -> keyring)，否则使用当前输入
    let fallback_key = try_load_stored_key(provider_id, normalized_key);

    // 3) 用解析后的密钥执行健康检查
    let result = health_check(
        provider_id,
        normalized_url,
        fallback_key
            .as_ref()
            .map(|k| k.as_str())
            .unwrap_or(normalized_key),
    )
    .await;

    // 健康检查失败，直接返回
    if !result.success {
        return ConnectAndSaveProviderResponse::fail(result.error);
    }

    // 4) 持久化密钥（仅用户显式输入时）
    // 快照紧邻写入：避免 health_check 异步窗口期间被并发 reset/connect 污染
    let previous_persisted_key = if !normalized_key.is_empty() {
        let snapshot = load_provider_key(provider_id);
        // 用户显式输入的 key 已通过健康检查，持久化到 keyring
        if let Err(e) = save_provider_key(provider_id, normalized_key) {
            return ConnectAndSaveProviderResponse::fail(Some(e.message()));
        }
        snapshot
    } else {
        // 用户未显式输入 key：来源可能是 env / keyring / 无需密钥，均无需持久化
        info!(
            "[Tauri] ⏭️ {} skip key persist: no user-supplied key",
            provider_id
        );
        None
    };

    // 5) 复用历史启用状态，并与本次可用模型做交集对齐
    let previous_record = match load_provider_record(app, provider_id) {
        Ok(record) => record,
        Err(e) => {
            return ConnectAndSaveProviderResponse::fail(Some(e.message()));
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

    // 按照 available_models 的顺序重新排列 enabled_models，保证前端渲染顺序稳定
    let ordered_enabled_models =
        reorder_enabled_models(&next_enabled_models, &result.available_models);

    // 6) 持久化写入配置
    let record = ProviderRecord {
        url: if normalized_url.is_empty() {
            None
        } else {
            Some(normalized_url.to_string())
        },
        enabled_models: ordered_enabled_models,
    };

    if let Err(e) = save_provider(app, provider_id, &record) {
        // 仅当本次显式输入了 key 时，才需要回滚 keyring 变更
        if !normalized_key.is_empty() {
            rollback_provider_key(
                provider_id,
                previous_persisted_key.as_ref().map(|k| k.as_str()),
                normalized_key,
            );
        }

        return ConnectAndSaveProviderResponse::fail(Some(e.message()));
    }

    // 成功：返回健康检查的 available_models 和持久化后的 enabled_models
    ConnectAndSaveProviderResponse::ok(result.available_models, record.enabled_models)
}
