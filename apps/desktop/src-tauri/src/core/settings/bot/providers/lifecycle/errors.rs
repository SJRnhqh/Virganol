// apps/desktop/src-tauri/src/core/settings/bot/providers/lifecycle/errors.rs
// 外部依赖
use log::error;
use tauri::AppHandle;

// 内部引用
use super::events;
use crate::core::models::providers::check::{ProviderCheckFailureDetail, ProviderCheckTrigger};

/// 生命周期异常处理：记录错误并立即尝试推送 failed 事件
pub(super) fn handle_lifecycle_failure(
    app: &AppHandle,
    run_id: &str,
    trigger: ProviderCheckTrigger,
    code: &str,
    message: &str,
    details: Vec<ProviderCheckFailureDetail>,
) {
    error!("[Tauri] ❌ {}", message);

    if let Err(emit_err) = events::emit_check_failed(app, run_id, trigger, code, message, details) {
        error!("[Tauri] ❌ {}", emit_err);
    } else {
        error!(
            "[Tauri] ❌ Provider check failed: run_id={}, trigger={:?}, code={}, message={}",
            run_id, trigger, code, message
        );
    }
}

pub(super) fn report_lifecycle_failure(
    app: &AppHandle,
    run_id: &str,
    trigger: ProviderCheckTrigger,
    code: &str,
    message: &str,
    details: Vec<ProviderCheckFailureDetail>,
) {
    error!("[Tauri] ❌ {}", message);

    if let Err(emit_err) = events::emit_check_failed(app, run_id, trigger, code, message, details) {
        error!("[Tauri] ❌ {}", emit_err);
    } else {
        error!(
            "[Tauri] ❌ Provider check failed: run_id={}, trigger={:?}, code={}, message={}",
            run_id, trigger, code, message
        );
    }
}
