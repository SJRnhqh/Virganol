// apps/desktop/src-tauri/src/core/bot/services/settings/provider/lifecycle/flow.rs
use log::{info, warn};
use std::time::Instant;
use tauri::AppHandle;

use super::super::super::super::super::{ProviderCheckTrigger, ProviderError, ProviderState};
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
    provider_state: &ProviderState,
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
        snapshot.total,
        snapshot.supported.len(),
        snapshot.skipped.len(),
    );

    for detail in &snapshot.skipped {
        warn!(
            "[Tauri] ⚠️ Skip unsupported provider in store: run_id={}, trigger={}, raw_id={}, code={}, message={}",
            run_id,
            trigger.as_tag(),
            detail.raw_id,
            detail.code,
            detail.message
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

    let check_result =
        run_provider_checks(&app, provider_state, run_id.as_str(), snapshot.supported).await;

    if let Some(e) = check_result.join_error.or_else(|| {
        (!check_result.provider_issues.is_empty()).then(|| {
            ProviderError::LifecycleConcurrentCheck(
                "concurrent check error: provider issues detected".to_string(),
            )
        })
    }) {
        report_lifecycle_failure(
            &app,
            run_id.as_str(),
            &trigger,
            &e,
            if check_result.provider_issues.is_empty() {
                None
            } else {
                Some(check_result.provider_issues)
            },
        );
        return;
    }

    let duration_ms = started_at.elapsed().as_millis() as u64;
    if let Err(e) = emit_check_completed(&app, run_id.as_str(), check_result.failed_count) {
        report_lifecycle_failure(&app, run_id.as_str(), &trigger, &e, None);
        return;
    }

    info!(
        "[Tauri] 🏁 Provider check completed: run_id={}, checked={}, failed={}, duration_ms={}",
        run_id, supported_total, check_result.failed_count, duration_ms
    );
}
