// apps/desktop/src-tauri/src/core/bot/services/settings/provider/lifecycle/runner.rs
use log::{error, info, warn};
use tauri::AppHandle;
use tokio::task::JoinSet;

use super::super::super::super::super::{
    ProviderAppError, ProviderCheckRunResult, ProviderError, ProviderId, ProviderIssue,
    ProviderRecord, ProviderState,
};
use super::super::health_check_with_resolved_key;
use super::{emit_check_status, finalize_provider_check_result};

/// Maximum number of provider health checks allowed to run concurrently.
///
/// Provider 健康检查允许同时运行的最大任务数量。
const CHECK_CONCURRENCY_LIMIT: usize = 4;

/// Runs provider health checks with bounded concurrency.
///
/// 使用有限并发执行 Provider 健康检查，并收集失败数量、Provider 级结构性问题与首个 join 错误。
pub(super) async fn run_provider_checks(
    app: &AppHandle,
    provider_state: &ProviderState,
    run_id: &str,
    supported: Vec<(ProviderId, ProviderRecord)>,
) -> ProviderCheckRunResult {
    let mut failed_count: usize = 0;
    let mut provider_issues: Vec<ProviderIssue> = Vec::new();
    let mut join_error: Option<ProviderError> = None;

    let mut pending = supported.into_iter();
    let mut in_flight = JoinSet::new();

    while pending.len() > 0 || !in_flight.is_empty() {
        while in_flight.len() < CHECK_CONCURRENCY_LIMIT {
            let Some((provider_id, record)) = pending.next() else {
                break;
            };
            in_flight.spawn(async move {
                let url = record.url().unwrap_or("").to_string();
                let (result, key_meta) = health_check_with_resolved_key(provider_id, &url).await;
                (provider_id, record, result, key_meta)
            });
        }

        match in_flight.join_next().await {
            Some(Ok((provider_id, record, result, key_meta))) => {
                let (status_record, online, reconciliation_error) = finalize_provider_check_result(
                    app,
                    provider_state,
                    provider_id,
                    record,
                    &result,
                )
                .into_parts();

                if let Some(e) = reconciliation_error {
                    provider_issues
                        .push(ProviderIssue::new(provider_id, ProviderAppError::from(e)));
                }

                if !online {
                    failed_count += 1;
                }

                info!(
                    "[Tauri] {} {} → online: {}",
                    if online { "✅" } else { "⚠️" },
                    provider_id,
                    online
                );

                if let Err(e) =
                    emit_check_status(app, run_id, provider_id, status_record, result, key_meta)
                {
                    provider_issues
                        .push(ProviderIssue::new(provider_id, ProviderAppError::from(e)));
                }
            }
            Some(Err(e)) => {
                if join_error.is_none() {
                    join_error = Some(ProviderError::CheckConcurrentFailed(format!(
                        "concurrent check error: {}",
                        e
                    )));
                    error!("[Tauri] ❌ concurrent check error: {}", e);
                } else {
                    warn!("[Tauri] ⚠️ concurrent check error (suppressed): {}", e);
                }
            }
            None => break,
        }
    }

    ProviderCheckRunResult::new(failed_count, provider_issues, join_error)
}
