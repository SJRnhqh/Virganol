// apps/desktop/src-tauri/src/core/settings/bot/providers/lifecycle/flow.rs
// 外部依赖
use log::{info, warn};
use std::time::Instant;
use tauri::AppHandle;

// 内部引用
use super::{errors, events, id, runner};
use crate::core::models::providers::check::{
    ProviderCheckFailureDetail, ProviderCheckStats, ProviderCheckTrigger,
};
use crate::core::settings::bot::providers::store::load_supported_providers;

/// LLM供应商的持久化配置读取、健康检查、结果推送完整生命周期管理
pub async fn check_providers_lifecycle(app: AppHandle, trigger: ProviderCheckTrigger) {
    // Step 1: 初始化本轮生命周期上下文（覆盖读取 + 检查 + 推送全链路）
    let run_id = id::next_run_id(trigger);
    let started_at = Instant::now();

    // Step 2: 读取持久化快照（支持项 + 跳过项）
    let snapshot = match load_supported_providers(&app) {
        Ok(snapshot) => snapshot,
        Err(error_msg) => {
            errors::handle_lifecycle_failure(
                &app,
                run_id.as_str(),
                trigger,
                "load_snapshot_failed",
                error_msg.as_str(),
                vec![ProviderCheckFailureDetail {
                    code: "load_snapshot_failed".to_string(),
                    provider: None,
                    message: error_msg.clone(),
                }],
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
            vec![ProviderCheckFailureDetail {
                code: "emit_started_failed".to_string(),
                provider: None,
                message: error_msg.clone(),
            }],
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
                vec![ProviderCheckFailureDetail {
                    code: "emit_completed_failed".to_string(),
                    provider: None,
                    message: error_msg.clone(),
                }],
            );
        }
        return;
    }

    // Step 4: 并发执行健康检查并收敛统计/结构性错误
    let (stats, lifecycle_errors) =
        runner::run_provider_checks(&app, run_id.as_str(), snapshot.supported).await;

    // Step 5: 发出生命周期 completed/partial_failure 终态事件
    let duration_ms = started_at.elapsed().as_millis() as u64;
    if lifecycle_errors.is_empty() {
        if let Err(error_msg) =
            events::emit_check_completed(&app, run_id.as_str(), trigger, stats, duration_ms)
        {
            errors::handle_lifecycle_failure(
                &app,
                run_id.as_str(),
                trigger,
                "emit_completed_failed",
                error_msg.as_str(),
                vec![ProviderCheckFailureDetail {
                    code: "emit_completed_failed".to_string(),
                    provider: None,
                    message: error_msg.clone(),
                }],
            );
            return;
        }

        info!(
            "[Tauri] 🏁 Provider check completed: run_id={}, processed={}, succeeded={}, failed={}, duration_ms={}",
            run_id, stats.processed, stats.succeeded, stats.failed, duration_ms
        );
        return;
    }

    let provider_scoped_errors = lifecycle_errors
        .iter()
        .filter(|detail| detail.provider.is_some())
        .count();
    let error_msg = format!(
        "provider check finished with {} lifecycle error(s), provider_scoped_errors={}",
        lifecycle_errors.len(),
        provider_scoped_errors
    );
    errors::handle_lifecycle_failure(
        &app,
        run_id.as_str(),
        trigger,
        "partial_failure",
        error_msg.as_str(),
        lifecycle_errors,
    );
}
