// apps/desktop/src-tauri/src/core/bot/services/settings/provider/lifecycle/failure.rs
use tauri::AppHandle;

use super::super::super::super::super::super::{AppLogger, Downgrade};
use super::super::super::super::super::{
    ProviderAppError, ProviderError, ProviderLifecycleContext, ProviderLogEntry,
};
use super::emit_check_failed;

/// Reports a lifecycle failure with log fallback.
///
/// 上报生命周期失败，日志兜底。
pub(super) fn report_lifecycle_failure(
    app: &AppHandle,
    logger: &AppLogger,
    ctx: &ProviderLifecycleContext,
    run_id: &str,
    error: &ProviderError,
    suppressed_errors: &[ProviderError],
) {
    ProviderLogEntry::record_failures(logger, [error].into_iter().chain(suppressed_errors));

    let app_error = match suppressed_errors {
        [] => ProviderAppError::from(error),
        suppressed_errors => ProviderAppError::with_suppressed_errors(
            error,
            suppressed_errors
                .iter()
                .map(ProviderAppError::from)
                .collect(),
        ),
    };

    if let Err(e) = emit_check_failed(app, ctx, run_id, app_error) {
        e.downgrade(logger);
    }
}
