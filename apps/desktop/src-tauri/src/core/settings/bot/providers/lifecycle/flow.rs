// apps/desktop/src-tauri/src/core/settings/bot/providers/lifecycle/flow.rs
// 外部依赖
use log::{info, warn};
use std::time::Instant;
use tauri::AppHandle;

// 内部引用
use super::{events, failure, rid, runner};
use crate::core::models::provider::check::ProviderCheckTrigger;
use crate::core::models::provider::error::ProviderError;
use crate::core::settings::bot::providers::store::load_supported_providers;

/// LLM供应商的持久化配置读取、健康检查、结果推送完整生命周期管理
pub(crate) async fn check_providers_lifecycle(app: AppHandle, trigger: ProviderCheckTrigger) {
    // Step 1: 初始化本轮生命周期上下文（覆盖读取 + 检查 + 推送全链路）
    let run_id = rid::next_run_id(trigger);
    let started_at = Instant::now();

    // Step 2: 发出生命周期 started 事件
    if let Err(err) = events::emit_check_started(&app, run_id.as_str(), trigger) {
        failure::report_lifecycle_failure(&app, run_id.as_str(), trigger, &err, None);
        return;
    }

    // Step 3: 读取持久化快照（支持项 + 跳过项）
    let snapshot = match load_supported_providers(&app) {
        Ok(snapshot) => snapshot,
        Err(err) => {
            failure::report_lifecycle_failure(&app, run_id.as_str(), trigger, &err, None);
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
        if let Err(err) = events::emit_check_completed(&app, run_id.as_str(), 0) {
            failure::report_lifecycle_failure(&app, run_id.as_str(), trigger, &err, None);
            return;
        }
        return;
    }

    // Step 4: 并发执行健康检查并收敛失败计数/结构性错误
    let (failed_count, provider_issues, join_error) =
        runner::run_provider_checks(&app, run_id.as_str(), snapshot.supported).await;

    // Step 5: 处理并发检查阶段结构性错误（全局并发错误或 provider 级结构性问题）
    // TODO: 后续若统一建设错误文案体系，需细化 join_error 与 provider_issues 同时存在时的 message 表达。
    if let Some(err) = join_error.or_else(|| {
        (!provider_issues.is_empty()).then(|| {
            ProviderError::LifecycleConcurrentCheck(
                "concurrent check error: provider issues detected".to_string(),
            )
        })
    }) {
        failure::report_lifecycle_failure(
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
    if let Err(err) = events::emit_check_completed(&app, run_id.as_str(), failed_count) {
        failure::report_lifecycle_failure(&app, run_id.as_str(), trigger, &err, None);
        return;
    }

    info!(
        "[Tauri] 🏁 Provider check completed: run_id={}, checked={}, failed={}, duration_ms={}",
        run_id, supported_total, failed_count, duration_ms
    );
}
