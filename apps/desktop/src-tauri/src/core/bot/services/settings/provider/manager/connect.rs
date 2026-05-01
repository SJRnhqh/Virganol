// apps/desktop/src-tauri/src/core/bot/services/settings/provider/manager/connect.rs
use log::{error, info};
use tauri::AppHandle;

use super::super::super::super::super::{
    compute_enabled_models, ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse,
    ProviderError, ProviderId, ProviderRecord, ProviderState,
};
use super::super::{
    health_check, load_provider_env, load_provider_key, load_provider_record, remove_provider_key,
    save_provider, save_provider_key,
};

/// Builds a provider record based on health check results.
///
/// 根据健康检查结果构造 Provider 配置记录，复用历史启用状态。
fn build_provider_record(
    app: &AppHandle,
    provider_id: ProviderId,
    normalized_url: &str,
    available_models: &[String],
) -> Result<ProviderRecord, ProviderError> {
    let previous_record = load_provider_record(app, provider_id)?;

    let enabled_models = previous_record
        .map(|record| compute_enabled_models(&record.enabled_models, available_models))
        .unwrap_or_default();

    Ok(ProviderRecord::new(normalized_url, enabled_models))
}

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

/// Connects to a provider and saves the configuration if health check succeeds.
///
/// 连接 Provider 并在健康检查成功后持久化配置。
pub(crate) async fn connect_and_save(
    app: &AppHandle,
    provider_state: &ProviderState,
    request: ConnectAndSaveProviderRequest,
) -> ConnectAndSaveProviderResponse {
    let ConnectAndSaveProviderRequest { provider_id, data } = request;

    let Some(data) = data else {
        return ConnectAndSaveProviderResponse::failure("missing data field");
    };

    let normalized_key = data.key.trim();
    let normalized_url = data.url.as_deref().unwrap_or("").trim();

    let fallback_key = normalized_key
        .is_empty()
        .then_some(())
        .and_then(|_| load_provider_env(provider_id).or_else(|| load_provider_key(provider_id)));

    let result = health_check(
        provider_id,
        normalized_url,
        fallback_key
            .as_ref()
            .map(|k| k.as_str())
            .unwrap_or(normalized_key),
    )
    .await;

    if !result.success {
        return ConnectAndSaveProviderResponse::failure(result.error.unwrap_or_default());
    }

    let previous_persisted_key = if !normalized_key.is_empty() {
        let snapshot = load_provider_key(provider_id);
        if let Err(e) = save_provider_key(provider_id, normalized_key) {
            return ConnectAndSaveProviderResponse::failure(e.message());
        }
        snapshot
    } else {
        None
    };

    let record =
        match build_provider_record(app, provider_id, normalized_url, &result.available_models) {
            Ok(record) => record,
            Err(e) => return ConnectAndSaveProviderResponse::failure(e.message()),
        };

    let enabled_models_for_response = record.enabled_models.clone();

    if let Err(e) = save_provider(app, provider_state, provider_id, record) {
        // 仅当本次显式输入了 key 时，才需要回滚 keyring 变更
        if !normalized_key.is_empty() {
            rollback_provider_key(
                provider_id,
                previous_persisted_key.as_ref().map(|k| k.as_str()),
                normalized_key,
            );
        }

        return ConnectAndSaveProviderResponse::failure(e.message());
    }

    // 成功：返回健康检查的 available_models 和持久化后的 enabled_models
    ConnectAndSaveProviderResponse::ok(result.available_models, enabled_models_for_response)
}
