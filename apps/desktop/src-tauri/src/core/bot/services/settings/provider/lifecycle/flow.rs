// apps/desktop/src-tauri/src/core/bot/services/settings/provider/lifecycle/flow.rs
use log::{info, warn};
use std::time::Instant;
use tauri::AppHandle;

use super::super::super::super::super::super::AppState;
use super::super::super::super::super::{
    ProviderCheckTrigger, ProviderError, ProviderLifecycleContext,
};
use super::super::load_provider_check_snapshot;
use super::{
    emit_check_completed, emit_check_started, next_run_id, report_lifecycle_failure,
    run_provider_checks,
};

/// Runs one provider lifecycle check from snapshot loading through event emission.
///
/// 管理一轮 Provider 生命周期检查，覆盖持久化快照读取、健康检查和事件推送。
pub(crate) async fn check_providers_lifecycle(
    app: AppHandle,
    state: &AppState,
    trigger: ProviderCheckTrigger,
) {
    let run_id = next_run_id(&trigger);
    let ctx = ProviderLifecycleContext::start(run_id.as_str(), &trigger);
    let started_at = Instant::now();

    if let Err(e) = emit_check_started(&app, &ctx, run_id.as_str(), &trigger) {
        report_lifecycle_failure(&app, &ctx, run_id.as_str(), &e, &[]);
        return;
    }

    let ctx = ctx.into_config_store();
    let snapshot = match load_provider_check_snapshot(&app, &ctx) {
        Ok(snapshot) => snapshot,
        Err(e) => {
            report_lifecycle_failure(&app, &ctx, run_id.as_str(), &e, &[]);
            return;
        }
    };
    let (loaded_total, supported_total, skipped_total) = (
        snapshot.total(),
        snapshot.supported_count(),
        snapshot.skipped_count(),
    );

    for raw_id in snapshot.skipped() {
        warn!(
            "[Tauri] ⚠️ Skip unsupported provider in store: run_id={}, trigger={}, raw_id={}",
            run_id,
            trigger.as_tag(),
            raw_id
        );
    }

    info!(
        "[Tauri] 🔎 provider check lifecycle snapshot: trigger={}, loaded={}, supported={}, skipped={}",
        trigger.as_tag(),
        loaded_total,
        supported_total,
        skipped_total
    );

    if supported_total == 0 {
        if loaded_total == 0 {
            info!(
                "[Tauri] 📭 No persisted providers found (trigger={})",
                trigger.as_tag()
            );
        } else {
            info!(
                "[Tauri] 📭 No supported providers found in persisted configs (loaded {}, skipped {}, trigger={})",
                loaded_total,
                skipped_total,
                trigger.as_tag()
            );
        }
        let ctx = ctx.into_lifecycle_emit();
        if let Err(e) = emit_check_completed(&app, &ctx, run_id.as_str(), supported_total) {
            report_lifecycle_failure(&app, &ctx, run_id.as_str(), &e, &[]);
            return;
        }
        return;
    }

    let check_result = run_provider_checks(
        &app,
        state.provider(),
        &ctx,
        run_id.as_str(),
        snapshot.into_supported(),
    )
    .await;

    let (failed_count, join_error, suppressed_errors) = check_result.into_parts();

    let primary_error = join_error
        .or_else(|| (!suppressed_errors.is_empty()).then_some(ProviderError::CheckAggregate));
    if let Some(e) = primary_error {
        report_lifecycle_failure(&app, &ctx, run_id.as_str(), &e, &suppressed_errors);
        return;
    }

    let duration_ms = started_at.elapsed().as_millis() as u64;
    let ctx = ctx.into_lifecycle_emit();
    if let Err(e) = emit_check_completed(&app, &ctx, run_id.as_str(), failed_count) {
        report_lifecycle_failure(&app, &ctx, run_id.as_str(), &e, &[]);
        return;
    }

    info!(
        "[Tauri] 🏁 Provider check completed: run_id={}, checked={}, failed={}, duration_ms={}",
        run_id, supported_total, failed_count, duration_ms
    );
}
