// apps/desktop/src-tauri/src/core/settings/bot/providers/lifecycle/flow.rs
// 外部依赖
use log::{info, warn};
use std::time::Instant;
use tauri::AppHandle;

// 内部引用
use super::{errors, events, id, runner};
use crate::core::models::providers::check::{ProviderCheckStats, ProviderCheckTrigger};
use crate::core::settings::bot::providers::store::load_supported_providers;

/// LLM供应商的持久化配置读取、健康检查、结果推送完整生命周期管理
pub async fn check_providers_lifecycle(app: AppHandle, trigger: ProviderCheckTrigger) {
    // Step 1: 初始化本轮生命周期上下文（覆盖读取 + 检查 + 推送全链路）
    let run_id = id::next_run_id(trigger);
    let started_at = Instant::now();

    // Step 2: 读取持久化快照（支持项 + 跳过项）
    let snapshot = match load_supported_providers(&app) {
        Ok(snapshot) => snapshot,
        Err(error) => {
            let message = error.message();
            errors::report_lifecycle_failure(
                &app,
                run_id.as_str(),
                trigger,
                error.code(),
                message.as_str(),
                None,
            );
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
            "[Tauri] ⚠️ Skip unsupported provider in store: raw_id={}, code={}, message={}",
            detail.raw_id, detail.code, detail.message
        );
    }

    info!(
        "[Tauri] 🔎 provider check lifecycle snapshot: trigger={:?}, loaded={}, supported={}, skipped={}",
        trigger, loaded_total, supported_total, skipped_total
    );

    // Step 3: 发出生命周期 started 事件
    if let Err(error_msg) = events::emit_check_started(
        &app,
        run_id.as_str(),
        trigger,
        supported_total, // total: 本轮实际要检查的支持项
        loaded_total,
        skipped_total,
    ) {
        errors::handle_lifecycle_failure(
            &app,
            run_id.as_str(),
            trigger,
            "emit_started_failed",
            error_msg.as_str(),
            None,
        );
        return;
    }

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
        let duration_ms = started_at.elapsed().as_millis() as u64;
        if let Err(error_msg) = events::emit_check_completed(
            &app,
            run_id.as_str(),
            trigger,
            ProviderCheckStats::default(),
            duration_ms,
        ) {
            errors::handle_lifecycle_failure(
                &app,
                run_id.as_str(),
                trigger,
                "emit_completed_failed",
                error_msg.as_str(),
                None,
            );
        }
        return;
    }

    // Step 4: 并发执行健康检查并收敛统计/结构性错误
    let (stats, provider_issues, lifecycle_error_count) =
        runner::run_provider_checks(&app, run_id.as_str(), snapshot.supported).await;

    // Step 5: 发出生命周期 completed/partial_failure 终态事件
    let duration_ms = started_at.elapsed().as_millis() as u64;
    if provider_issues.is_empty() && lifecycle_error_count == 0 {
        if let Err(error_msg) =
            events::emit_check_completed(&app, run_id.as_str(), trigger, stats, duration_ms)
        {
            errors::handle_lifecycle_failure(
                &app,
                run_id.as_str(),
                trigger,
                "emit_completed_failed",
                error_msg.as_str(),
                None,
            );
            return;
        }

        info!(
            "[Tauri] 🏁 Provider check completed: run_id={}, processed={}, succeeded={}, failed={}, duration_ms={}",
            run_id, stats.processed, stats.succeeded, stats.failed, duration_ms
        );
        return;
    }

    let provider_issue_count = provider_issues.len();
    let error_msg = format!(
        "provider check finished with lifecycle_error_count={}, provider_issue_count={}",
        lifecycle_error_count, provider_issue_count
    );
    let issues = if provider_issues.is_empty() {
        None
    } else {
        Some(provider_issues)
    };
    errors::handle_lifecycle_failure(
        &app,
        run_id.as_str(),
        trigger,
        "partial_failure",
        error_msg.as_str(),
        issues,
    );
}
