// apps/desktop/src-tauri/src/core/bot/services/settings/provider/manager/connect.rs
use tauri::AppHandle;

use super::super::super::super::super::{
    compute_enabled_models, ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse,
    ProviderError, ProviderId, ProviderRecord, ProviderState,
};
use super::super::{
    load_provider_record, probe_provider_connection, save_provider, ProviderKeyTransaction,
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

    let result = probe_provider_connection(provider_id, normalized_url, normalized_key).await;

    if !result.success {
        return ConnectAndSaveProviderResponse::failure(result.error.unwrap_or_default());
    }

    let record =
        match build_provider_record(app, provider_id, normalized_url, &result.available_models) {
            Ok(record) => record,
            Err(e) => return ConnectAndSaveProviderResponse::failure(e.message()),
        };

    let enabled_models = record.enabled_models.clone();

    let key_transaction = match ProviderKeyTransaction::begin(provider_id, normalized_key) {
        Ok(transaction) => transaction,
        Err(e) => return ConnectAndSaveProviderResponse::failure(e.message()),
    };

    if let Err(e) = save_provider(app, provider_state, provider_id, record) {
        return ConnectAndSaveProviderResponse::failure(e.message());
    }

    if let Some(transaction) = key_transaction {
        transaction.commit();
    }

    ConnectAndSaveProviderResponse::ok(result.available_models, enabled_models)
}
