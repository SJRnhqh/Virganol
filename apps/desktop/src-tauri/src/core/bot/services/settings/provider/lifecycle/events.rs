// apps/desktop/src-tauri/src/core/bot/services/settings/provider/lifecycle/events.rs
use tauri::{AppHandle, Emitter};

use super::super::super::super::super::models::{
    HealthCheckResult, ProviderCheckCompletedPayload, ProviderCheckFailedPayload,
    ProviderCheckStartedPayload, ProviderCheckTrigger, ProviderError, ProviderId, ProviderIssue,
    ProviderRecord, ProviderSecretMeta, ProviderStatusPayload,
};

// 事件名常量（与前端 PROVIDER_CHECK_EVENTS 保持一致）
const EVT_CHECK_STARTED: &str = "providers-check-lifecycle-started";
const EVT_PROVIDER_STATUS: &str = "provider-status";
const EVT_CHECK_COMPLETED: &str = "providers-check-lifecycle-completed";
const EVT_CHECK_FAILED: &str = "providers-check-lifecycle-failed";

/// Emits the lifecycle started event.
///
/// 推送生命周期 started 事件。
pub(super) fn emit_check_started(
    app: &AppHandle,
    run_id: &str,
    trigger: &ProviderCheckTrigger,
) -> Result<(), ProviderError> {
    let payload = ProviderCheckStartedPayload { run_id, trigger };

    app.emit(EVT_CHECK_STARTED, &payload).map_err(|e| {
        ProviderError::LifecycleEventEmit(format!("emit {} failed: {}", EVT_CHECK_STARTED, e))
    })
}

/// 推送单个 Provider 的状态事件
pub(super) fn emit_provider_status(
    app: &AppHandle,
    run_id: &str,
    provider_id: ProviderId,
    config: ProviderRecord,
    health: HealthCheckResult,
    secret_meta: ProviderSecretMeta,
) -> Result<(), ProviderError> {
    let payload = ProviderStatusPayload {
        run_id: run_id.to_string(),
        provider: provider_id,
        config,
        health,
        secret_meta,
    };

    app.emit(EVT_PROVIDER_STATUS, &payload).map_err(|e| {
        ProviderError::LifecycleEventEmit(format!("emit {} failed: {}", EVT_PROVIDER_STATUS, e))
    })
}

/// 推送生命周期 completed 事件
pub(super) fn emit_check_completed(
    app: &AppHandle,
    run_id: &str,
    failed: usize,
) -> Result<(), ProviderError> {
    let payload = ProviderCheckCompletedPayload {
        run_id: run_id.to_string(),
        failed,
    };

    app.emit(EVT_CHECK_COMPLETED, &payload).map_err(|e| {
        ProviderError::LifecycleEventEmit(format!("emit {} failed: {}", EVT_CHECK_COMPLETED, e))
    })
}

/// Emits the lifecycle failed event.
///
/// 推送生命周期 failed 事件。
pub(super) fn emit_check_failed(
    app: &AppHandle,
    run_id: &str,
    error: &ProviderError,
    issues: Option<&[ProviderIssue]>,
) -> Result<(), ProviderError> {
    let payload = ProviderCheckFailedPayload {
        run_id,
        code: error.code(),
        message: error.message(),
        issues,
    };

    app.emit(EVT_CHECK_FAILED, &payload).map_err(|e| {
        ProviderError::LifecycleEventEmit(format!("emit {} failed: {}", EVT_CHECK_FAILED, e))
    })
}
