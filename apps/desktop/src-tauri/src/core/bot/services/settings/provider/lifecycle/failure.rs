// apps/desktop/src-tauri/src/core/bot/services/settings/provider/lifecycle/failure.rs
use log::error;
use tauri::AppHandle;

use super::super::super::super::super::super::Downgrade;
use super::super::super::super::super::{ProviderAppError, ProviderCheckTrigger, ProviderError};
use super::emit_check_failed;

/// Reports a lifecycle failure through the failed event with log fallback.
///
/// 通过 failed 事件上报生命周期失败，并在事件推送失败时使用日志兜底。
pub(super) fn report_lifecycle_failure(
    app: &AppHandle,
    run_id: &str,
    trigger: &ProviderCheckTrigger,
    error: &ProviderError,
    suppressed_errors: &[ProviderError],
) {
    let app_error = match suppressed_errors {
        [] => ProviderAppError::from(error),
        suppressed_errors => {
            let suppressed_errors = suppressed_errors
                .iter()
                .map(ProviderAppError::from)
                .collect();
            ProviderAppError::with_suppressed_errors(error, suppressed_errors)
        }
    };

    if let Err(e) = emit_check_failed(app, run_id, app_error) {
        e.downgrade();
        error.downgrade();
        for e in suppressed_errors {
            e.downgrade();
        }
        error!(
            "[Tauri] ❌ lifecycle failed event emit fallback: run_id={}, trigger={}",
            run_id,
            trigger.as_tag(),
        );
    }
}
