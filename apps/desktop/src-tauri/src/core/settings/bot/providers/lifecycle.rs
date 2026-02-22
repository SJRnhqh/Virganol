// apps/desktop/src-tauri/src/core/settings/bot/providers/lifecycle.rs
// 外部依赖
use log::{error, info, warn};
use std::time::Instant;
use tauri::{AppHandle, Emitter};
use tokio::task::JoinSet;

// 内部引用
use crate::core::models::provider::ProviderId;
use crate::core::models::providers::check::{
    ProviderCheckCompletedPayload, ProviderCheckFailedPayload, ProviderCheckFailureDetail,
    ProviderCheckStartedPayload, ProviderCheckStats, ProviderCheckTrigger, ProviderStatusPayload,
};
use crate::core::models::settings::{HealthCheckResponse, ProviderRecord};
use crate::core::settings::bot::providers::store::load_supported_providers;
mod id;
mod processor;
mod resolver;

// === 默认流程：持久化配置校验与结果推送 === //
const CHECK_CONCURRENCY_LIMIT: usize = 4;

/// 推送生命周期 started 事件
fn emit_check_started(
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

/// 生命周期异常处理：记录错误并立即尝试推送 failed 事件
fn handle_lifecycle_failure(
    app: &AppHandle,
    run_id: &str,
    trigger: ProviderCheckTrigger,
    code: &str,
    message: &str,
    details: Vec<ProviderCheckFailureDetail>,
) {
    error!("[Tauri] ❌ {}", message);

    if let Err(emit_err) = emit_check_failed(app, run_id, trigger, code, message, details) {
        error!("[Tauri] ❌ {}", emit_err);
    } else {
        error!(
            "[Tauri] ❌ Provider check failed: run_id={}, trigger={:?}, code={}, message={}",
            run_id, trigger, code, message
        );
    }
}

/// 推送单个 Provider 的状态事件
fn emit_provider_status(
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
fn emit_check_completed(
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
fn emit_check_failed(
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

/// LLM供应商的持久化配置读取、健康检查、结果推送完整生命周期管理
pub async fn check_providers_lifecycle(app: AppHandle, trigger: ProviderCheckTrigger) {
    // Step 1: 初始化本轮生命周期上下文（覆盖读取 + 检查 + 推送全链路）
    let run_id = id::next_run_id(trigger);
    let started_at = Instant::now();

    // Step 2: 读取持久化快照（支持项 + 跳过项）
    let snapshot = match load_supported_providers(&app) {
        Ok(snapshot) => snapshot,
        Err(error_msg) => {
            handle_lifecycle_failure(
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
    if let Err(error_msg) = emit_check_started(
        &app,
        run_id.as_str(),
        trigger,
        supported_total, // total: 本轮实际要检查的支持项
        loaded_total,
        skipped_total,
    ) {
        handle_lifecycle_failure(
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
        if let Err(error_msg) = emit_check_completed(
            &app,
            run_id.as_str(),
            trigger,
            ProviderCheckStats::default(),
            duration_ms,
        ) {
            handle_lifecycle_failure(
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

    // Step 4: 初始化本轮统计信息与结构性错误收集器
    let mut stats = ProviderCheckStats::default();
    let mut lifecycle_errors: Vec<ProviderCheckFailureDetail> = Vec::new();

    // Step 5: 并发健康检查，并按完成顺序逐条推送 provider-status
    let mut pending: std::collections::VecDeque<(ProviderId, ProviderRecord)> =
        snapshot.supported.into();
    let mut in_flight = JoinSet::new();

    // 并发调度循环：队列未清空或仍有在途任务时持续推进
    while !pending.is_empty() || !in_flight.is_empty() {
        // 1) 尽可能把任务补满到并发上限
        while in_flight.len() < CHECK_CONCURRENCY_LIMIT {
            // FIFO 取出一个待检查 provider；队列空则停止补位
            let Some((provider_id, record)) = pending.pop_front() else {
                break;
            };

            // 提交一个健康检查任务到 in_flight，完成后返回 (provider_id, record, result)
            in_flight.spawn(async move {
                let url = record.url.as_deref().unwrap_or("").to_string();
                let result = resolver::health_check_with_resolved_key(provider_id, &url).await;
                (provider_id, record, result)
            });
        }

        // 2) 消费一个已完成任务（完成即处理，增量推送）
        match in_flight.join_next().await {
            Some(Ok((provider_id, record, result))) => {
                let (final_record, online, reconcile_error) =
                    processor::process_provider_check_result(&app, provider_id, record, &result);

                if let Some(error_msg) = reconcile_error {
                    lifecycle_errors.push(ProviderCheckFailureDetail {
                        code: "enabled_models_reconcile_persist_failed".to_string(),
                        provider: Some(provider_id),
                        message: error_msg,
                    });
                }

                // 统计：这条 provider 已处理完成
                stats.record(online);

                let icon = if online { "✅" } else { "⚠️" };
                info!("[Tauri] {} {} → online: {}", icon, provider_id, online);

                if let Err(error_msg) =
                    emit_provider_status(&app, run_id.as_str(), provider_id, final_record, result)
                {
                    error!("[Tauri] ❌ emit_status_failed: {}", error_msg);
                    lifecycle_errors.push(ProviderCheckFailureDetail {
                        code: "emit_status_failed".to_string(),
                        provider: Some(provider_id),
                        message: error_msg,
                    });
                }
            }
            Some(Err(join_error)) => {
                let msg = format!("provider check task join failed: {}", join_error);
                error!("[Tauri] ❌ join_failed: {}", msg);
                lifecycle_errors.push(ProviderCheckFailureDetail {
                    code: "join_failed".to_string(),
                    provider: None,
                    message: msg,
                });
            }
            None => break,
        }
    }

    // Step 6: 发出生命周期 completed 事件
    let duration_ms = started_at.elapsed().as_millis() as u64;
    if lifecycle_errors.is_empty() {
        if let Err(error_msg) =
            emit_check_completed(&app, run_id.as_str(), trigger, stats, duration_ms)
        {
            handle_lifecycle_failure(
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
    handle_lifecycle_failure(
        &app,
        run_id.as_str(),
        trigger,
        "partial_failure",
        error_msg.as_str(),
        lifecycle_errors,
    );
}
