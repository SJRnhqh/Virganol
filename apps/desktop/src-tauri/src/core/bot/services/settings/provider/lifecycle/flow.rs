// apps/desktop/src-tauri/src/core/bot/services/settings/provider/lifecycle/flow.rs
use log::{info, warn};
use std::time::Instant;
use tauri::AppHandle;

use super::super::super::super::super::{ProviderCheckTrigger, ProviderError, ProviderState};
use super::super::load_supported_providers;
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

    // Step 2: Emit the lifecycle started event.
    // 发出生命周期 started 事件。
    if let Err(err) = emit_check_started(&app, run_id.as_str(), &trigger) {
        report_lifecycle_failure(&app, run_id.as_str(), &trigger, &err, None);
        return;
    }

    // Step 3: Load the persisted provider snapshot.
    // 读取持久化快照，拆分为支持项和跳过项。
    let snapshot = match load_supported_providers(&app) {
        Ok(snapshot) => snapshot,
        Err(err) => {
            report_lifecycle_failure(&app, run_id.as_str(), &trigger, &err, None);
            return;
        }
    };
    let (loaded_total, supported_total, skipped_total) = (
        snapshot.total,
        snapshot.supported.len(),
        snapshot.skipped.len(),
    );

    // Unsupported persisted providers are skipped, not promoted to lifecycle failures.
    // 已持久化但当前不支持的 Provider 只记录日志，不触发 lifecycle_failed。
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

    // No supported provider still completes the lifecycle event chain.
    // 无可检查项时，started 之后仍发 completed 终态，保持事件闭环。
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
        if let Err(err) = emit_check_completed(&app, run_id.as_str(), 0) {
            report_lifecycle_failure(&app, run_id.as_str(), &trigger, &err, None);
            return;
        }
        return;
    }

    // Step 4: Run health checks and collect structural failures.
    // 并发执行健康检查，并收敛失败计数与结构性错误。
    let (failed_count, provider_issues, join_error) =
        run_provider_checks(&app, provider_state, run_id.as_str(), snapshot.supported).await;

    // Step 5: Promote structural failures into the lifecycle failed event.
    // 处理并发检查阶段的全局并发错误或 Provider 级结构性问题。
    // 优先级：join_error（任务 panic）> provider_issues（个别 provider 结构性失败）。
    // join_error 存在时直接作为错误主体，provider_issues 若非空仍一并传入 payload；
    // 无 join_error 时若 issues 非空则手动构造等价错误；两者皆无则跳过进入 Step 6。
    if let Some(err) = join_error.or_else(|| {
        (!provider_issues.is_empty()).then(|| {
            ProviderError::LifecycleConcurrentCheck(
                "concurrent check error: provider issues detected".to_string(),
            )
        })
    }) {
        report_lifecycle_failure(
            &app,
            run_id.as_str(),
            &trigger,
            &err,
            if provider_issues.is_empty() {
                None
            } else {
                Some(provider_issues)
            },
        );
        return;
    }

    // Step 6: Emit the lifecycle completed event.
    // 推送生命周期 completed 事件。
    let duration_ms = started_at.elapsed().as_millis() as u64;
    if let Err(err) = emit_check_completed(&app, run_id.as_str(), failed_count) {
        report_lifecycle_failure(&app, run_id.as_str(), &trigger, &err, None);
        return;
    }

    info!(
        "[Tauri] 🏁 Provider check completed: run_id={}, checked={}, failed={}, duration_ms={}",
        run_id, supported_total, failed_count, duration_ms
    );
}
