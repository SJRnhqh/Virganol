// apps/desktop/src-tauri/src/core/settings/bot/providers/lifecycle/runner.rs
// 外部依赖
use log::{error, info, warn};
use tauri::AppHandle;
use tokio::task::JoinSet;

// 内部引用
use super::{events, processor, resolver};
use crate::core::bot::models::provider::ProviderId;
use crate::core::models::provider::error::{ProviderError, ProviderIssue};
use crate::core::models::settings::ProviderRecord;

/// 并发健康检查最大并发度
const CHECK_CONCURRENCY_LIMIT: usize = 4;

/// 执行并发健康检查主循环，返回失败数量与生命周期错误明细
pub(super) async fn run_provider_checks(
    app: &AppHandle,
    run_id: &str,
    supported: Vec<(ProviderId, ProviderRecord)>,
) -> (usize, Vec<ProviderIssue>, Option<ProviderError>) {
    let mut failed_count: usize = 0;
    let mut provider_issues: Vec<ProviderIssue> = Vec::new();
    let mut join_error: Option<ProviderError> = None;

    // 标记是否已记录过并发错误（保证只记录一次）
    // join_next().await 串行消费，无并发写竞争，普通 bool 即可
    let mut has_join_error = false;

    let mut pending: std::collections::VecDeque<(ProviderId, ProviderRecord)> = supported.into();
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
                let (result, secret_meta) =
                    resolver::health_check_with_secret_meta(provider_id, &url).await;
                (provider_id, record, result, secret_meta)
            });
        }

        // 2) 消费一个已完成任务（完成即处理，增量推送）
        match in_flight.join_next().await {
            Some(Ok((provider_id, record, result, secret_meta))) => {
                let (final_record, online, reconcile_error) =
                    processor::process_provider_check_result(app, provider_id, record, &result);

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

                if let Err(err) = events::emit_provider_status(
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

    (failed_count, provider_issues, join_error)
}
