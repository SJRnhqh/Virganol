// apps/desktop/src-tauri/src/core/bot/services/settings/provider/lifecycle/failure.rs
use log::error;
use tauri::AppHandle;

use super::super::super::super::super::super::Downgrade;
use super::super::super::super::super::{ProviderCheckTrigger, ProviderError, ProviderIssue};
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
    if let Err(e) = emit_check_failed(app, run_id, error, issues.as_deref()) {
        e.downgrade();
        error.downgrade();
        match &issues {
            Some(issues) => {
                error!(
                    "[Tauri] ❌ lifecycle failed event emit fallback: run_id={}, trigger={}, issues_count={}",
                    run_id,
                    trigger.as_tag(),
                    issues.len(),
                );
            }
            None => {
                error!(
                    "[Tauri] ❌ lifecycle failed event emit fallback: run_id={}, trigger={}",
                    run_id,
                    trigger.as_tag(),
                );
            }
        }
    }
}
