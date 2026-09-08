// apps/desktop/src-tauri/src/core/bot/services/settings/provider/manager/update.rs
use tauri::AppHandle;

use super::super::super::super::super::super::{AppLogger, AppState};
use super::super::super::super::super::{
    ProviderAppError, ProviderError, ProviderLogEntry, ProviderManagerContext, ProviderSpan,
    UpdateEnabledModelsRequest, UpdateEnabledModelsResponse,
};
use super::super::update_models;
use super::fail;

/// Updates enabled models for a provider.
///
/// 更新指定供应商的启用模型列表。
pub(crate) fn update_provider_enabled_models(
    app: &AppHandle,
    logger: &AppLogger,
    state: &AppState,
    request: UpdateEnabledModelsRequest,
) -> Result<UpdateEnabledModelsResponse, ProviderAppError> {
    let (provider_id, data) = request.into_parts();
    let ctx = ProviderManagerContext::update_models(provider_id);
    let _entered = ProviderSpan::manager(&ctx).entered();
    let provider_state = state.provider();

    let data = match data {
        Some(data) => data,
        None => {
            let e = ProviderError::manager_request_payload_absent(&ctx);
            return Err(fail(logger, &e));
        }
    };

    let update_result = {
        let ctx = ctx.for_config_store().into_execution_context();

        update_models(
            app,
            provider_state,
            &ctx,
            provider_id,
            data.into_enabled_models(),
        )
    };

    match update_result {
        Ok(()) => {
            ProviderLogEntry::record_enabled_models_updated(logger, &ctx);
            Ok(UpdateEnabledModelsResponse::success())
        }
        Err(e) => Err(fail(logger, &e)),
    }
}
