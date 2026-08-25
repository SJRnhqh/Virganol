// apps/desktop/src-tauri/src/core/bot/services/settings/provider/manager/reset.rs
use tauri::AppHandle;

use super::super::super::super::super::super::AppState;
use super::super::super::super::super::{
    ProviderAppError, ProviderLogEntry, ProviderManagerContext, ResetProviderRequest,
    ResetProviderResponse,
};
use super::super::{remove_provider, remove_provider_key, save_provider};

/// Resets persisted configuration for a provider.
///
/// 重置指定供应商的持久化配置。
pub(crate) fn reset_provider_config(
    app: &AppHandle,
    state: &AppState,
    request: ResetProviderRequest,
) -> Result<ResetProviderResponse, ProviderAppError> {
    let provider_id = request.into_provider_id();
    let ctx = ProviderManagerContext::reset(provider_id);
    let provider_state = state.provider();

    let ctx = ctx.into_config_store().into_execution_context();

    let previous = match remove_provider(app, provider_state, &ctx, provider_id) {
        Ok(removed) => removed,
        Err(e) => {
            // Observes the failure before returning it to the application boundary.
            //
            // 在返回应用边界错误前观测失败；条目暂未发出。
            let _entry = ProviderLogEntry::observe_failure(&ctx, &e);
            return Err(ProviderAppError::from(&e));
        }
    };

    let ctx = ctx.into_secret_store();

    if let Err(e) = remove_provider_key(&ctx, provider_id) {
        if let Some(record) = previous {
            let ctx = ctx.into_config_store();

            if let Err(se) = save_provider(app, provider_state, &ctx, provider_id, record) {
                return Err(ProviderAppError::with_suppressed_errors(
                    &e,
                    vec![ProviderAppError::from(&se)],
                ));
            }
        }
        return Err(ProviderAppError::from(&e));
    }

    Ok(ResetProviderResponse::success())
}
