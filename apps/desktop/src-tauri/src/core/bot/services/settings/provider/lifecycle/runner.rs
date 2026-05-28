// apps/desktop/src-tauri/src/core/bot/services/settings/provider/lifecycle/runner.rs
use log::{error, info, warn};
use std::collections::VecDeque;
use tauri::AppHandle;
use tokio::task::JoinSet;

use super::super::super::super::super::models::{
    ProviderCheckRunResult, ProviderError, ProviderId, ProviderIssue, ProviderRecord, ProviderState,
};
use super::super::health_check_with_resolved_key;
use super::{emit_provider_status, process_provider_check_result};

/// 并发健康检查最大并发度
const CHECK_CONCURRENCY_LIMIT: usize = 4;

/// 执行并发健康检查主循环，返回失败数量与生命周期错误明细
pub(super) async fn run_provider_checks(
    app: &AppHandle,
    provider_state: &ProviderState,
    run_id: &str,
    supported: Vec<(ProviderId, ProviderRecord)>,
) -> ProviderCheckRunResult {
    let mut failed_count: usize = 0;
    let mut provider_issues: Vec<ProviderIssue> = Vec::new();
    let mut join_error: Option<ProviderError> = None;

    let mut has_join_error = false;

    let mut pending: VecDeque<(ProviderId, ProviderRecord)> = supported.into();
    let mut in_flight = JoinSet::new();

    while !pending.is_empty() || !in_flight.is_empty() {
        while in_flight.len() < CHECK_CONCURRENCY_LIMIT {
            let Some((provider_id, record)) = pending.pop_front() else {
                break;
            };
            in_flight.spawn(async move {
                let url = record.url.as_deref().unwrap_or("").to_string();
                let (result, secret_meta) = health_check_with_resolved_key(provider_id, &url).await;
                (provider_id, record, result, secret_meta)
            });
        }

        match in_flight.join_next().await {
            Some(Ok((provider_id, record, result, secret_meta))) => {
                let (final_record, online, reconcile_error) = process_provider_check_result(
                    app,
                    provider_state,
                    provider_id,
                    record,
                    &result,
                );

                if let Some(err) = reconcile_error {
                    let message = err.message();
                    provider_issues.push(ProviderIssue::new(provider_id, err.code(), message));
                }

                // 统计：健康检查失败计数
                if !online {
                    failed_count += 1;
                }

                let icon = if online { "✅" } else { "⚠️" };
                info!("[Tauri] {} {} → online: {}", icon, provider_id, online);

                if let Err(err) = emit_provider_status(
                    app,
                    run_id,
                    provider_id,
                    final_record,
                    result,
                    secret_meta,
                ) {
                    provider_issues.push(ProviderIssue::new(
                        provider_id,
                        err.code(),
                        err.message(),
                    ));
                }
            }
            Some(Err(err)) => {
                // 不提前退出循环：即使发生 panic，其余 in-flight 任务的结果仍需消费并推送给前端。
                // 单次赋值：只在第一次发生时记录
                if !has_join_error {
                    has_join_error = true;
                    join_error = Some(ProviderError::LifecycleConcurrentCheck(format!(
                        "concurrent check error: {}",
                        err
                    )));
                    error!("[Tauri] ❌ concurrent check error: {}", err);
                } else {
                    // 后续静默降级为日志打印
                    warn!("[Tauri] ⚠️ concurrent check error (suppressed): {}", err);
                }
            }
            None => break,
        }
    }

    ProviderCheckRunResult {
        failed_count,
        provider_issues,
        join_error,
    }
}
