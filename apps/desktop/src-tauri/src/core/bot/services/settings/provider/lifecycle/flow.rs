// apps/desktop/src-tauri/src/core/bot/services/settings/provider/lifecycle/flow.rs
use log::{info, warn};
use std::time::Instant;
use tauri::AppHandle;

use super::super::super::super::super::super::AppState;
use super::super::super::super::super::{ProviderCheckTrigger, ProviderError};
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
    let started_at = Instant::now();

    if let Err(e) = emit_check_started(&app, run_id.as_str(), &trigger) {
        report_lifecycle_failure(&app, run_id.as_str(), &trigger, &e, None);
        return;
    }

    let snapshot = match load_provider_check_snapshot(&app) {
        Ok(snapshot) => snapshot,
        Err(e) => {
            report_lifecycle_failure(&app, run_id.as_str(), &trigger, &e, None);
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
        if let Err(e) = emit_check_completed(&app, run_id.as_str(), supported_total) {
            report_lifecycle_failure(&app, run_id.as_str(), &trigger, &e, None);
            return;
        }
        return;
    }

    let check_result = run_provider_checks(
        &app,
        state.provider(),
        run_id.as_str(),
        snapshot.into_supported(),
    )
    .await;

    let (failed_count, provider_issues, join_error) = check_result.into_parts();

    if let Some(e) = join_error.or_else(|| {
        (!provider_issues.is_empty()).then(|| {
            ProviderError::CheckConcurrentFailed(
                "concurrent check error: provider issues detected".to_string(),
            )
        })
    }) {
        report_lifecycle_failure(
            &app,
            run_id.as_str(),
            &trigger,
            &e,
            if provider_issues.is_empty() {
                None
            } else {
                Some(provider_issues)
            },
        );
        return;
    }

    let duration_ms = started_at.elapsed().as_millis() as u64;
    if let Err(e) = emit_check_completed(&app, run_id.as_str(), failed_count) {
        report_lifecycle_failure(&app, run_id.as_str(), &trigger, &e, None);
        return;
    }

    info!(
        "[Tauri] 🏁 Provider check completed: run_id={}, checked={}, failed={}, duration_ms={}",
        run_id, supported_total, failed_count, duration_ms
    );
}
