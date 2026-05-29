// apps/desktop/src-tauri/src/core/bot/services/settings/provider/lifecycle/failure.rs
use log::error;
use tauri::AppHandle;

use super::super::super::super::super::models::{
    ProviderCheckTrigger, ProviderError, ProviderIssue,
};
use super::emit_check_failed;

/// Reports a lifecycle failure through the failed event with log fallback.
///
/// 通过 failed 事件上报生命周期失败，并在事件推送失败时使用日志兜底。
pub(super) fn report_lifecycle_failure(
    app: &AppHandle,
    run_id: &str,
    trigger: &ProviderCheckTrigger,
    error: &ProviderError,
    issues: Option<Vec<ProviderIssue>>,
) {
    if let Err(emit_err) = emit_check_failed(app, run_id, error, issues.as_deref()) {
        let code = error.code();
        let message = error.message();
        match &issues {
            Some(issues) => {
                error!(
                    "[Tauri] ❌ emit providers-check-failed fallback: run_id={}, trigger={}, code={}, message={}, issues={:?}, emit_err={}",
                    run_id,
                    trigger.as_tag(),
                    code,
                    message,
                    issues,
                    emit_err
                );
            }
            None => {
                error!(
                    "[Tauri] ❌ emit providers-check-failed fallback: run_id={}, trigger={}, code={}, message={}, emit_err={}",
                    run_id,
                    trigger.as_tag(),
                    code,
                    message,
                    emit_err
                );
            }
        }
    }
}
