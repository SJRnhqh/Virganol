// apps/desktop/src-tauri/src/core/bot/services/settings/provider/lifecycle/events.rs
use tauri::{AppHandle, Emitter};

use super::super::super::super::super::{
    HealthCheckResult, ProviderAppError, ProviderCheckCompletedPayload, ProviderCheckFailedPayload,
    ProviderCheckStartedPayload, ProviderCheckStatusPayload, ProviderCheckTrigger, ProviderError,
    ProviderExecutionContext, ProviderId, ProviderKeyMeta, ProviderLifecycleContext,
    ProviderRecord,
};

/// Event name for the start of a provider check lifecycle run.
///
/// 供应商检查生命周期开始事件名。
const EVT_CHECK_STARTED: &str = "providers-check-lifecycle-started";

/// Event name for one provider check status update.
///
/// 单个供应商检查状态更新事件名。
const EVT_CHECK_STATUS: &str = "provider-status";

/// Event name for successful completion of a provider check lifecycle run.
///
/// 供应商检查生命周期成功完成事件名。
const EVT_CHECK_COMPLETED: &str = "providers-check-lifecycle-completed";

/// Event name for failure of a provider check lifecycle run.
///
/// 供应商检查生命周期失败事件名。
const EVT_CHECK_FAILED: &str = "providers-check-lifecycle-failed";

/// Emits the lifecycle started event.
///
/// 推送生命周期开始事件。
pub(super) fn emit_check_started(
    app: &AppHandle,
    ctx: &ProviderLifecycleContext,
    run_id: &str,
    trigger: &ProviderCheckTrigger,
) -> Result<(), ProviderError> {
    let payload = ProviderCheckStartedPayload::new(run_id, trigger);

    app.emit(EVT_CHECK_STARTED, &payload)
        .map_err(|source| ProviderError::check_started_emit(ctx, source))
}

/// Emits one provider check status event.
///
/// 推送单个供应商状态事件。
pub(super) fn emit_check_status(
    app: &AppHandle,
    ctx: &ProviderExecutionContext,
    run_id: &str,
    provider_id: ProviderId,
    config: ProviderRecord,
    health: HealthCheckResult,
    key_meta: ProviderKeyMeta,
) -> Result<(), ProviderError> {
    let payload = ProviderCheckStatusPayload::new(run_id, provider_id, config, health, key_meta);

    app.emit(EVT_CHECK_STATUS, &payload)
        .map_err(|source| ProviderError::check_status_emit(ctx, source))
}

/// Emits the lifecycle completed event.
///
/// 推送生命周期完成事件。
pub(super) fn emit_check_completed(
    app: &AppHandle,
    ctx: &ProviderLifecycleContext,
    run_id: &str,
    failed: usize,
) -> Result<(), ProviderError> {
    let payload = ProviderCheckCompletedPayload::new(run_id, failed);

    app.emit(EVT_CHECK_COMPLETED, &payload)
        .map_err(|source| ProviderError::check_completed_emit(ctx, source))
}

/// Emits the lifecycle failed event.
///
/// 推送生命周期失败事件。
pub(super) fn emit_check_failed(
    app: &AppHandle,
    ctx: &ProviderLifecycleContext,
    run_id: &str,
    error: ProviderAppError,
) -> Result<(), ProviderError> {
    let payload = ProviderCheckFailedPayload::new(run_id, error);

    app.emit(EVT_CHECK_FAILED, &payload)
        .map_err(|source| ProviderError::check_failed_emit(ctx, source))
}
