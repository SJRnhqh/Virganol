// apps/desktop/src-tauri/src/core/settings/bot/providers/lifecycle/failure.rs
// 外部依赖
use log::error;
use tauri::AppHandle;

// 内部引用
use super::events;
use crate::core::models::provider::check::ProviderCheckTrigger;
use crate::core::models::provider::error::{ProviderError, ProviderIssue};

pub(super) fn report_lifecycle_failure(
    app: &AppHandle,
    run_id: &str,
    trigger: ProviderCheckTrigger,
    error: &ProviderError,
    issues: Option<Vec<ProviderIssue>>,
) {
    if let Err(emit_err) = events::emit_check_failed(app, run_id, error, issues.clone()) {
        // 日志打印报错兜底
        let code = error.code();
        let message = error.message();
        match &issues {
            Some(issues) => {
                error!(
                    "[Tauri] ❌ emit providers-check-failed fallback: run_id={}, trigger={:?}, code={}, message={}, issues={:?}, emit_err={}",
                    run_id, trigger, code, message, issues, emit_err
                );
            }
            None => {
                error!(
                    "[Tauri] ❌ emit providers-check-failed fallback: run_id={}, trigger={:?}, code={}, message={}, emit_err={}",
                    run_id, trigger, code, message, emit_err
                );
            }
        }
    }
}
