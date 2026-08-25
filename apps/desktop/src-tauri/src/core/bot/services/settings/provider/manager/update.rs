// apps/desktop/src-tauri/src/core/bot/services/settings/provider/manager/update.rs
use tauri::AppHandle;

use super::super::super::super::super::super::AppState;
use super::super::super::super::super::{
    ProviderAppError, ProviderError, ProviderLogEntry, ProviderManagerContext,
    UpdateEnabledModelsRequest, UpdateEnabledModelsResponse,
};
use super::super::update_models;

/// Updates enabled models for a provider.
///
/// 更新指定供应商的启用模型列表。
pub(crate) fn update_provider_enabled_models(
    app: &AppHandle,
    state: &AppState,
    request: UpdateEnabledModelsRequest,
) -> Result<UpdateEnabledModelsResponse, ProviderAppError> {
    let (provider_id, data) = request.into_parts();
    let ctx = ProviderManagerContext::update_models(provider_id);
    let provider_state = state.provider();

    let data = match data {
        Some(data) => data,
        None => {
            let e = ProviderError::manager_request_payload_absent(&ctx);
            // Observes the failure before returning it to the application boundary.
            //
            // 在返回应用边界错误前观测失败；条目暂未发出。
            let _entry = ProviderLogEntry::observe_failure(&ctx, &e);
            return Err(ProviderAppError::from(&e));
        }
    };

    let ctx = ctx.into_config_store().into_execution_context();

    match update_models(
        app,
        provider_state,
        &ctx,
        provider_id,
        data.into_enabled_models(),
    ) {
        Ok(()) => Ok(UpdateEnabledModelsResponse::success()),
        Err(e) => Err(ProviderAppError::from(&e)),
    }
}
