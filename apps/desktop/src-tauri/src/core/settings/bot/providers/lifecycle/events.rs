// apps/desktop/src-tauri/src/core/settings/bot/providers/lifecycle/events.rs
// 外部依赖
use tauri::{AppHandle, Emitter};

// 内部引用
use super::resolver;
use crate::core::models::provider::ProviderId;
use crate::core::models::providers::check::{
    ProviderCheckCompletedPayload, ProviderCheckFailedPayload, ProviderCheckFailureDetail,
    ProviderCheckStartedPayload, ProviderCheckStats, ProviderCheckTrigger, ProviderStatusPayload,
};
use crate::core::models::settings::{HealthCheckResponse, ProviderRecord};

/// 推送生命周期 started 事件
pub(super) fn emit_check_started(
    app: &AppHandle,
    run_id: &str,
    trigger: ProviderCheckTrigger,
    total: usize,
    loaded_total: usize,
    skipped_total: usize,
) -> Result<(), String> {
    let payload = ProviderCheckStartedPayload {
        run_id: run_id.to_string(),
        trigger,
        total,
        loaded_total,
        skipped_total,
    };

    app.emit("providers-check-started", &payload)
        .map_err(|e| format!("emit providers-check-started failed: {}", e))
}

/// 推送单个 Provider 的状态事件
pub(super) fn emit_provider_status(
    app: &AppHandle,
    run_id: &str,
    provider_id: ProviderId,
    config: ProviderRecord,
    health: HealthCheckResponse,
) -> Result<(), String> {
    let payload = ProviderStatusPayload {
        run_id: run_id.to_string(),
        provider: provider_id,
        config,
        health,
        secret_meta: resolver::resolve_provider_secret_meta(provider_id),
    };

    app.emit("provider-status", &payload)
        .map_err(|e| format!("emit provider-status failed: {}", e))
}

/// 推送生命周期 completed 事件
pub(super) fn emit_check_completed(
    app: &AppHandle,
    run_id: &str,
    trigger: ProviderCheckTrigger,
    stats: ProviderCheckStats,
    duration_ms: u64,
) -> Result<(), String> {
    let payload = ProviderCheckCompletedPayload {
        run_id: run_id.to_string(),
        trigger,
        processed: stats.processed,
        succeeded: stats.succeeded,
        failed: stats.failed,
        duration_ms,
    };

    app.emit("providers-check-completed", &payload)
        .map_err(|e| format!("emit providers-check-completed failed: {}", e))
}

/// 推送生命周期 failed 事件
pub(super) fn emit_check_failed(
    app: &AppHandle,
    run_id: &str,
    trigger: ProviderCheckTrigger,
    code: &str,
    message: &str,
    details: Vec<ProviderCheckFailureDetail>,
) -> Result<(), String> {
    let payload = ProviderCheckFailedPayload {
        run_id: run_id.to_string(),
        trigger,
        code: code.to_string(),
        message: message.to_string(),
        error_count: details.len(),
        details,
    };

    app.emit("providers-check-failed", &payload)
        .map_err(|e| format!("emit providers-check-failed failed: {}", e))
}
