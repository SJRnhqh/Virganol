// apps/desktop/src-tauri/src/core/bot/services/settings/provider/lifecycle/events.rs
use tauri::{AppHandle, Emitter};

use super::super::super::super::super::{
    HealthCheckResult, ProviderAppError, ProviderCheckCompletedPayload, ProviderCheckFailedPayload,
    ProviderCheckStartedPayload, ProviderCheckStatusPayload, ProviderCheckTrigger, ProviderError,
    ProviderId, ProviderIssue, ProviderKeyMeta, ProviderRecord,
};

// Provider check lifecycle event names kept aligned with frontend PROVIDER_CHECK_EVENTS.
//
// Provider 检查生命周期事件名常量，与前端 PROVIDER_CHECK_EVENTS 保持一致。
const EVT_CHECK_STARTED: &str = "providers-check-lifecycle-started";
const EVT_CHECK_STATUS: &str = "provider-status";
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
    let payload = ProviderCheckStartedPayload::new(run_id, trigger);

    app.emit(EVT_CHECK_STARTED, &payload)
        .map_err(|source| ProviderError::CheckStartedEmit { source })
}

/// Emits one provider check status event.
///
/// 推送单个 Provider 的 check status 事件。
pub(super) fn emit_check_status(
    app: &AppHandle,
    run_id: &str,
    provider_id: ProviderId,
    config: ProviderRecord,
    health: HealthCheckResult,
    key_meta: ProviderKeyMeta,
) -> Result<(), ProviderError> {
    let payload = ProviderCheckStatusPayload::new(run_id, provider_id, config, health, key_meta);

    app.emit(EVT_CHECK_STATUS, &payload)
        .map_err(|source| ProviderError::CheckStatusEmit {
            provider_id,
            source,
        })
}

/// Emits the lifecycle completed event.
///
/// 推送生命周期 completed 事件。
pub(super) fn emit_check_completed(
    app: &AppHandle,
    run_id: &str,
    failed: usize,
) -> Result<(), ProviderError> {
    let payload = ProviderCheckCompletedPayload::new(run_id, failed);

    app.emit(EVT_CHECK_COMPLETED, &payload)
        .map_err(|source| ProviderError::CheckCompletedEmit { source })
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
    let payload = ProviderCheckFailedPayload::new(run_id, ProviderAppError::from(error), issues);

    app.emit(EVT_CHECK_FAILED, &payload)
        .map_err(|source| ProviderError::CheckFailedEmit { source })
}
