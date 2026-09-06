// apps/desktop/src-tauri/src/core/bot/services/settings/provider/manager/reset.rs
use tauri::AppHandle;

use super::super::super::super::super::super::{AppLogger, AppState};
use super::super::super::super::super::{
    ProviderAppError, ProviderLogEntry, ProviderManagerContext, ProviderSpan, ResetProviderRequest,
    ResetProviderResponse,
};
use super::super::{remove_provider, remove_provider_key, save_provider};
use super::fail;

/// Resets persisted configuration for a provider.
///
/// 重置指定供应商的持久化配置。
pub(crate) fn reset_provider_config(
    app: &AppHandle,
    logger: &AppLogger,
    state: &AppState,
    request: ResetProviderRequest,
) -> Result<ResetProviderResponse, ProviderAppError> {
    let provider_id = request.into_provider_id();
    let ctx = ProviderManagerContext::reset(provider_id);
    let _entered = ProviderSpan::manager(&ctx).entered();
    let provider_state = state.provider();

    let previous = {
        let ctx = ctx.for_config_store().into_execution_context();

        match remove_provider(app, logger, provider_state, &ctx, provider_id) {
            Ok(removed) => removed,
            Err(e) => return Err(fail(logger, &e)),
        }
    };

    if let Err(e) = {
        let ctx = ctx.for_secret_store().into_execution_context();

        remove_provider_key(&ctx, provider_id)
    } {
        if let Some(record) = previous {
            let ctx = ctx.for_config_store().into_execution_context();

            if let Err(se) = save_provider(app, provider_state, &ctx, provider_id, record) {
                ProviderLogEntry::record_failure_with_suppressed(logger, &e, [&se]);
                return Err(ProviderAppError::with_suppressed_errors(
                    &e,
                    vec![ProviderAppError::from(&se)],
                ));
            }

            ProviderLogEntry::record_provider_config_restored(logger, &ctx);
        }
        return Err(fail(logger, &e));
    }

    ProviderLogEntry::record_provider_reset(logger, &ctx);
    Ok(ResetProviderResponse::success())
}
