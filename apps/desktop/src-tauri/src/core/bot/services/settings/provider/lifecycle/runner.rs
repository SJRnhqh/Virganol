// apps/desktop/src-tauri/src/core/bot/services/settings/provider/lifecycle/runner.rs
use log::{error, info};
use tauri::AppHandle;
use tokio::task::JoinSet;

use super::super::super::super::super::super::Downgrade;
use super::super::super::super::super::{
    ProviderCheckRunResult, ProviderError, ProviderId, ProviderLifecycleContext, ProviderRecord,
    ProviderState,
};
use super::super::health_check_with_resolved_key;
use super::{emit_check_status, finalize_provider_check_result};

/// Maximum number of provider health checks allowed to run concurrently.
///
/// Provider 健康检查允许同时运行的最大任务数量。
const CHECK_CONCURRENCY_LIMIT: usize = 4;

/// Runs provider health checks with bounded concurrency.
///
/// 使用有限并发执行 Provider 健康检查，并收集失败数量、被抑制错误与首个 join 错误。
pub(super) async fn run_provider_checks(
    app: &AppHandle,
    provider_state: &ProviderState,
    ctx: &ProviderLifecycleContext<'_>,
    run_id: &str,
    supported: Vec<(ProviderId, ProviderRecord)>,
) -> ProviderCheckRunResult {
    let mut failed_count: usize = 0;
    let mut suppressed_errors: Vec<ProviderError> = Vec::new();
    let mut join_error: Option<ProviderError> = None;

    let mut pending = supported.into_iter();
    let mut in_flight = JoinSet::new();

    while pending.len() > 0 || !in_flight.is_empty() {
        while in_flight.len() < CHECK_CONCURRENCY_LIMIT {
            let Some((provider_id, record)) = pending.next() else {
                break;
            };
            let ctx = ctx
                .for_connection()
                .into_execution_context_with(provider_id.into());
            in_flight.spawn(async move {
                let url = record.url().unwrap_or("").to_string();
                let (result, key_meta) =
                    health_check_with_resolved_key(&ctx, provider_id, &url).await;
                (provider_id, record, result, key_meta)
            });
        }

        match in_flight.join_next().await {
            Some(Ok((provider_id, record, result, key_meta))) => {
                let (status_record, online, reconciliation_error) = finalize_provider_check_result(
                    app,
                    provider_state,
                    ctx,
                    provider_id,
                    record,
                    &result,
                )
                .into_parts();

                if let Some(se) = reconciliation_error {
                    suppressed_errors.push(se);
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

                if let Err(se) = {
                    let ctx = ctx
                        .for_connection()
                        .into_execution_context_with(provider_id.into());
                    emit_check_status(
                        app,
                        &ctx,
                        run_id,
                        provider_id,
                        status_record,
                        result,
                        key_meta,
                    )
                } {
                    suppressed_errors.push(se);
                }
            }
            Some(Err(source)) => {
                if join_error.is_none() {
                    error!("[Tauri] ❌ concurrent check error: {}", source);
                    join_error = Some(ProviderError::CheckTaskJoin { source });
                } else {
                    ProviderError::CheckTaskJoin { source }.downgrade();
                }
            }
            None => break,
        }
    }

    ProviderCheckRunResult::new(failed_count, join_error, suppressed_errors)
}
