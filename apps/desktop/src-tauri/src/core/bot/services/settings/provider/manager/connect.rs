// apps/desktop/src-tauri/src/core/bot/services/settings/provider/manager/connect.rs
use tauri::AppHandle;
use tracing::Instrument;

use super::super::super::super::super::super::{AppLogger, AppState, LogLevel::Info};
use super::super::super::super::super::{
    ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse, ProviderAppError, ProviderError,
    ProviderLogEntry, ProviderManagerContext, ProviderRecord, ProviderSpan,
};
use super::super::{
    load_provider_record, probe_provider_connection, save_provider, ProviderKeyTransaction,
};

/// Connects a provider and saves its configuration after a successful probe.
///
/// 连接供应商，并在探测成功后保存配置。
pub(crate) async fn connect_and_save(
    app: &AppHandle,
    logger: &AppLogger,
    state: &AppState,
    request: ConnectAndSaveProviderRequest,
) -> Result<ConnectAndSaveProviderResponse, ProviderAppError> {
    let (provider_id, data) = request.into_parts();
    let ctx = ProviderManagerContext::connect(provider_id);
    let span = ProviderSpan::manager(&ctx);

    async move {
        let provider_state = state.provider();

        let data = match data {
            Some(data) => data,
            None => {
                let e = ProviderError::manager_request_payload_absent(&ctx);
                ProviderLogEntry::record_failure(logger, &e);
                return Err(ProviderAppError::from(&e));
            }
        };

        let normalized_key = data.normalized_api_key();
        let normalized_url = data.normalized_base_url();
        let ctx = ctx.into_connection().into_execution_context();

        let available_models = match probe_provider_connection(
            logger,
            &ctx,
            provider_id,
            normalized_url,
            normalized_key,
        )
        .instrument(ProviderSpan::execution(&ctx))
        .await
        .into_models()
        {
            Ok(models) => models,
            Err(e) => {
                ProviderLogEntry::record_failure(logger, &e);
                return Err(ProviderAppError::from(&e));
            }
        };

        let ctx = ctx.into_config_store();

        let previous_record = match load_provider_record(app, &ctx, provider_id) {
            Ok(record) => record,
            Err(e) => {
                ProviderLogEntry::record_failure(logger, &e);
                return Err(ProviderAppError::from(&e));
            }
        };

        let record = ProviderRecord::from_connection(
            normalized_url,
            &available_models,
            previous_record.as_ref(),
        );

        let enabled_models = record.enabled_models().to_vec();

        let key_transaction = {
            let ctx = ctx.for_secret_store();

            match ProviderKeyTransaction::begin(logger, ctx, provider_id, normalized_key) {
                Ok(transaction) => transaction,
                Err(e) => {
                    ProviderLogEntry::record_failure(logger, &e);
                    return Err(ProviderAppError::from(&e));
                }
            }
        };

        if let Err(e) = save_provider(app, provider_state, &ctx, provider_id, record) {
            ProviderLogEntry::record_failure(logger, &e);
            return Err(ProviderAppError::from(&e));
        }

        if let Some(transaction) = key_transaction {
            transaction.commit();
        }

        ProviderLogEntry::record_provider_connected(logger, Info, &ctx);
        Ok(ConnectAndSaveProviderResponse::success(
            available_models,
            enabled_models,
        ))
    }
    .instrument(span)
    .await
}
