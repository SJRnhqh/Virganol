// apps/desktop/src-tauri/src/core/settings/bot/providers/lifecycle/runner.rs
// 外部依赖
use log::{error, info};
use tauri::AppHandle;
use tokio::task::JoinSet;

// 内部引用
use super::{events, processor, resolver};
use crate::core::models::provider::check::ProviderCheckStats;
use crate::core::models::provider::error::{ProviderError, ProviderIssue};
use crate::core::models::provider::id::ProviderId;
use crate::core::models::settings::ProviderRecord;

/// 并发健康检查最大并发度
const CHECK_CONCURRENCY_LIMIT: usize = 4;

/// 执行并发健康检查主循环，返回统计信息与生命周期错误明细
pub(super) async fn run_provider_checks(
    app: &AppHandle,
    run_id: &str,
    supported: Vec<(ProviderId, ProviderRecord)>,
) -> (ProviderCheckStats, Vec<ProviderIssue>, Vec<ProviderError>) {
    let mut stats = ProviderCheckStats::default();
    let mut provider_issues: Vec<ProviderIssue> = Vec::new();
    let mut lifecycle_errors: Vec<ProviderError> = Vec::new();

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
                let result = resolver::health_check_with_resolved_key(provider_id, &url).await;
                (provider_id, record, result)
            });
        }

        // 2) 消费一个已完成任务（完成即处理，增量推送）
        match in_flight.join_next().await {
            Some(Ok((provider_id, record, result))) => {
                let (final_record, online, reconcile_error) =
                    processor::process_provider_check_result(app, provider_id, record, &result);

                if let Some(err) = reconcile_error {
                    let message = err.message();
                    provider_issues.push(ProviderIssue::new(provider_id, err.code(), message));
                }

                // 统计：这条 provider 已处理完成
                stats.record(online);

                let icon = if online { "✅" } else { "⚠️" };
                info!("[Tauri] {} {} → online: {}", icon, provider_id, online);

                if let Err(err) =
                    events::emit_provider_status(app, run_id, provider_id, final_record, result)
                {
                    provider_issues.push(ProviderIssue::new(
                        provider_id,
                        err.code(),
                        err.message(),
                    ));
                }
            }
            Some(Err(join_error)) => {
                let err = ProviderError::LifecycleTaskJoin(format!("{}", join_error));
                error!("[Tauri] ❌ {}", err.message());
                lifecycle_errors.push(err);
            }
            None => break,
        }
    }

    (stats, provider_issues, lifecycle_errors)
}
