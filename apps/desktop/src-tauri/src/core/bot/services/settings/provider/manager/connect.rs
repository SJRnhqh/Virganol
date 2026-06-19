// apps/desktop/src-tauri/src/core/bot/services/settings/provider/manager/connect.rs
use tauri::AppHandle;

use super::super::super::super::super::super::AppState;
use super::super::super::super::super::{
    ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse, ProviderAppError, ProviderError,
    ProviderRecord,
};
use super::super::{
    load_provider_record, probe_provider_connection, save_provider, ProviderKeyTransaction,
};

/// Connects to a provider and saves the configuration if health check succeeds.
///
/// 连接 Provider 并在健康检查成功后持久化配置。
pub(crate) async fn connect_and_save(
    app: &AppHandle,
    state: &AppState,
    request: ConnectAndSaveProviderRequest,
) -> ConnectAndSaveProviderResponse {
    let (provider_id, data) = request.into_parts();
    let provider_state = state.provider();

    let data = match data {
        Some(data) => data,
        None => {
            let e = ProviderError::ManagerRequestPayloadAbsent { provider_id };
            return ConnectAndSaveProviderResponse::failure(ProviderAppError::from(&e));
        }
    };

    let normalized_key = data.normalized_api_key();
    let normalized_url = data.normalized_base_url();

    let available_models =
        match probe_provider_connection(provider_id, normalized_url, normalized_key)
            .await
            .into_models()
        {
            Ok(models) => models,
            Err(e) => {
                return ConnectAndSaveProviderResponse::failure(
                    ProviderAppError::with_provider_id(&e, provider_id),
                );
            }
        };

    let previous_record = match load_provider_record(app, provider_id) {
        Ok(record) => record,
        Err(e) => {
            return ConnectAndSaveProviderResponse::failure(ProviderAppError::with_provider_id(
                &e,
                provider_id,
            ));
        }
    };

    let record = ProviderRecord::from_connection(
        normalized_url,
        &available_models,
        previous_record.as_ref(),
    );

    let enabled_models = record.enabled_models().to_vec();

    let key_transaction = match ProviderKeyTransaction::begin(provider_id, normalized_key) {
        Ok(transaction) => transaction,
        Err(e) => {
            return ConnectAndSaveProviderResponse::failure(ProviderAppError::with_provider_id(
                &e,
                provider_id,
            ));
        }
    };

    if let Err(e) = save_provider(app, provider_state, provider_id, record) {
        return ConnectAndSaveProviderResponse::failure(ProviderAppError::with_provider_id(
            &e,
            provider_id,
        ));
    }

    if let Some(transaction) = key_transaction {
        transaction.commit();
    }

    ConnectAndSaveProviderResponse::ok(available_models, enabled_models)
}
