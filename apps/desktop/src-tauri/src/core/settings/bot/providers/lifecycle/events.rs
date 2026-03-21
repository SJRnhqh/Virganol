// apps/desktop/src-tauri/src/core/settings/bot/providers/lifecycle/events.rs
// 外部依赖
use tauri::{AppHandle, Emitter};

// 内部引用
use super::resolver;
use crate::core::models::provider::check::{
    ProviderCheckCompletedPayload, ProviderCheckFailedPayload, ProviderCheckStartedPayload,
    ProviderCheckTrigger, ProviderStatusPayload,
};
use crate::core::models::provider::error::{ProviderError, ProviderIssue};
use crate::core::models::provider::ProviderId;
use crate::core::models::settings::{HealthCheckResponse, ProviderRecord};

/// 推送生命周期 started 事件
pub(super) fn emit_check_started(
    app: &AppHandle,
    run_id: &str,
    trigger: ProviderCheckTrigger,
) -> Result<(), ProviderError> {
    let payload = ProviderCheckStartedPayload {
        run_id: run_id.to_string(),
        trigger,
    };

    app.emit("providers-check-lifecycle-started", &payload)
        .map_err(|e| {
            ProviderError::LifecycleEventEmit(format!(
                "emit providers-check-lifecycle-started failed: {}",
                e
            ))
        })
}

/// 推送单个 Provider 的状态事件
pub(super) fn emit_provider_status(
    app: &AppHandle,
    run_id: &str,
    provider_id: ProviderId,
    config: ProviderRecord,
    health: HealthCheckResponse,
) -> Result<(), ProviderError> {
    let payload = ProviderStatusPayload {
        run_id: run_id.to_string(),
        provider: provider_id,
        config,
        health,
        secret_meta: resolver::resolve_provider_secret_meta(provider_id),
    };

    app.emit("provider-status", &payload).map_err(|e| {
        ProviderError::LifecycleEventEmit(format!("emit provider-status failed: {}", e))
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

    app.emit("providers-check-lifecycle-completed", &payload)
        .map_err(|e| {
            ProviderError::LifecycleEventEmit(format!(
                "emit providers-check-lifecycle-completed failed: {}",
                e
            ))
        })
}

/// 推送生命周期 failed 事件
pub(super) fn emit_check_failed(
    app: &AppHandle,
    run_id: &str,
    error: &ProviderError,
    issues: Option<&[ProviderIssue]>,
) -> Result<(), ProviderError> {
    let payload = ProviderCheckFailedPayload {
        run_id: run_id.to_string(),
        code: error.code(),
        message: error.message(),
        issues,
    };

    app.emit("providers-check-lifecycle-failed", &payload)
        .map_err(|e| {
            ProviderError::LifecycleEventEmit(format!(
                "emit providers-check-lifecycle-failed failed: {}",
                e
            ))
        })
}
