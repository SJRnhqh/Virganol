// apps/desktop/src-tauri/src/core/settings/bot/providers/lifecycle/errors.rs
// 外部依赖
use log::error;
use tauri::AppHandle;

// 内部引用
use super::events;
use crate::core::models::providers::check::ProviderCheckTrigger;
use crate::core::models::providers::issue::ProviderIssue;

pub(super) fn report_lifecycle_failure(
    app: &AppHandle,
    run_id: &str,
    trigger: ProviderCheckTrigger,
    code: &str,
    message: &str,
    issues: Option<Vec<ProviderIssue>>,
) {
    if let Err(emit_err) = events::emit_check_failed(app, run_id, trigger, code, message, issues) {
        // 日志打印报错兜底
        error!(
            "[Tauri] ❌ emit providers-check-failed fallback: run_id={}, trigger={:?}, code={}, message={}, emit_err={}",
            run_id, trigger, code, message, emit_err
        );
    }
}
