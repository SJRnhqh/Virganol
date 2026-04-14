// apps/desktop/src-tauri/src/core/bot/services/settings/provider/lifecycle/flow.rs
// 外部依赖
use log::{info, warn};
use std::time::Instant;
use tauri::AppHandle;

// 内部引用
use super::super::load_supported_providers;
use super::{
    emit_check_completed, emit_check_started, next_run_id, report_lifecycle_failure,
    run_provider_checks,
};
use crate::core::bot::models::{ProviderCheckTrigger, ProviderError};

/// LLM供应商的持久化配置读取、健康检查、结果推送完整生命周期管理
pub(crate) async fn check_providers_lifecycle(app: AppHandle, trigger: ProviderCheckTrigger) {
    // Step 1: 初始化本轮生命周期上下文（覆盖读取 + 检查 + 推送全链路）
    let run_id = next_run_id(trigger);
    let started_at = Instant::now();

    // Step 2: 发出生命周期 started 事件
    if let Err(err) = emit_check_started(&app, run_id.as_str(), trigger) {
        report_lifecycle_failure(&app, run_id.as_str(), trigger, &err, None);
        return;
    }

    // Step 3: 读取持久化快照（支持项 + 跳过项）
    let snapshot = match load_supported_providers(&app) {
        Ok(snapshot) => snapshot,
        Err(err) => {
            report_lifecycle_failure(&app, run_id.as_str(), trigger, &err, None);
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
            "[Tauri] ⚠️ Skip unsupported provider in store: run_id={}, trigger={:?}, raw_id={}, code={}, message={}",
            run_id, trigger, detail.raw_id, detail.code, detail.message
        );
    }

    info!(
        "[Tauri] 🔎 provider check lifecycle snapshot: trigger={:?}, loaded={}, supported={}, skipped={}",
        trigger, loaded_total, supported_total, skipped_total
    );

    // 无可检查项：started 之后仍发 completed 终态，保持生命周期事件闭环。
    if supported_total == 0 {
        if loaded_total == 0 {
            info!(
                "[Tauri] 📭 No persisted providers found (trigger={:?})",
                trigger
            );
        } else {
            info!(
                "[Tauri] 📭 No supported providers found in persisted configs (loaded {}, skipped {}, trigger={:?})",
                loaded_total, skipped_total, trigger
            );
        }
        if let Err(err) = emit_check_completed(&app, run_id.as_str(), 0) {
            report_lifecycle_failure(&app, run_id.as_str(), trigger, &err, None);
            return;
        }
        return;
    }

    // Step 4: 并发执行健康检查并收敛失败计数/结构性错误
    let (failed_count, provider_issues, join_error) =
        run_provider_checks(&app, run_id.as_str(), snapshot.supported).await;

    // Step 5: 处理并发检查阶段结构性错误（全局并发错误或 provider 级结构性问题）
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
            trigger,
            &err,
            if provider_issues.is_empty() {
                None
            } else {
                Some(provider_issues)
            },
        );
        return;
    }

    // Step 6: 推送生命周期completed事件
    let duration_ms = started_at.elapsed().as_millis() as u64;
    if let Err(err) = emit_check_completed(&app, run_id.as_str(), failed_count) {
        report_lifecycle_failure(&app, run_id.as_str(), trigger, &err, None);
        return;
    }

    info!(
        "[Tauri] 🏁 Provider check completed: run_id={}, checked={}, failed={}, duration_ms={}",
        run_id, supported_total, failed_count, duration_ms
    );
}
