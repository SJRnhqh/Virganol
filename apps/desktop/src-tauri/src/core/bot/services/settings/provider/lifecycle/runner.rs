// apps/desktop/src-tauri/src/core/bot/services/settings/provider/lifecycle/runner.rs
use log::{error, info, warn};
use tauri::AppHandle;
use tokio::task::JoinSet;

use super::super::super::super::super::models::{
    ProviderCheckRunResult, ProviderError, ProviderId, ProviderIssue, ProviderRecord, ProviderState,
};
use super::super::health_check_with_resolved_key;
use super::{emit_provider_status, finalize_provider_check_result};

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

    let mut pending = supported.into_iter();
    let mut in_flight = JoinSet::new();

    while pending.len() > 0 || !in_flight.is_empty() {
        while in_flight.len() < CHECK_CONCURRENCY_LIMIT {
            let Some((provider_id, record)) = pending.next() else {
                break;
            };
            in_flight.spawn(async move {
                let url = record.url.as_deref().unwrap_or("").to_string();
                let (result, key_meta) = health_check_with_resolved_key(provider_id, &url).await;
                (provider_id, record, result, key_meta)
            });
        }

        match in_flight.join_next().await {
            Some(Ok((provider_id, record, result, key_meta))) => {
                let finalization = finalize_provider_check_result(
                    app,
                    provider_state,
                    provider_id,
                    record,
                    &result,
                );

                if let Some(e) = finalization.reconcile_error {
                    let message = e.message();
                    provider_issues.push(ProviderIssue::new(provider_id, e.code(), message));
                }

                if !finalization.online {
                    failed_count += 1;
                }

                let icon = if finalization.online { "✅" } else { "⚠️" };
                info!(
                    "[Tauri] {} {} → online: {}",
                    icon, provider_id, finalization.online
                );

                if let Err(e) = emit_provider_status(
                    app,
                    run_id,
                    provider_id,
                    finalization.final_record,
                    result,
                    key_meta,
                ) {
                    provider_issues.push(ProviderIssue::new(provider_id, e.code(), e.message()));
                }
            }
            Some(Err(e)) => {
                if join_error.is_none() {
                    join_error = Some(ProviderError::LifecycleConcurrentCheck(format!(
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

    ProviderCheckRunResult {
        failed_count,
        provider_issues,
        join_error,
    }
}
