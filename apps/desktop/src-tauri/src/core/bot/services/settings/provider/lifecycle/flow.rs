// apps/desktop/src-tauri/src/core/bot/services/settings/provider/lifecycle/flow.rs
use tauri::AppHandle;
use tracing::Instrument;

use super::super::super::super::super::super::{AppLogger, AppState};
use super::super::super::super::super::{
    ProviderCheckTrigger, ProviderError, ProviderLifecycleContext, ProviderLogEntry, ProviderSpan,
    ProviderSubject,
};
use super::super::load_checkable_providers;
use super::{
    emit_check_completed, emit_check_started, next_run_id, report_lifecycle_failure,
    run_provider_checks,
};

/// Orchestrates one provider lifecycle check run.
///
/// 编排一轮供应商生命周期检查。
pub(crate) async fn check_providers_lifecycle(
    app: AppHandle,
    logger: &AppLogger,
    state: &AppState,
    trigger: ProviderCheckTrigger,
) {
    let run_id = next_run_id(&trigger);
    let ctx = ProviderLifecycleContext::start(run_id.as_str(), &trigger);
    let span = ProviderSpan::lifecycle(&ctx);

    async {
        ProviderLogEntry::record_check_started(logger, &ctx);

        if let Err(e) = emit_check_started(&app, &ctx, run_id.as_str(), &trigger) {
            report_lifecycle_failure(&app, logger, &ctx, run_id.as_str(), &e, &[]);
            return;
        }

        let providers = match {
            let ctx = ctx
                .for_config_store()
                .into_execution_context_with(ProviderSubject::configured_providers());
            load_checkable_providers(&app, logger, &ctx)
        } {
            Ok(providers) => providers,
            Err(e) => {
                report_lifecycle_failure(&app, logger, &ctx, run_id.as_str(), &e, &[]);
                return;
            }
        };
        if providers.is_empty() {
            complete_provider_check(&app, logger, &ctx, run_id.as_str(), 0);
            return;
        }

        let check_result = run_provider_checks(
            &app,
            logger,
            state.provider(),
            &ctx,
            run_id.as_str(),
            providers,
        )
        .await;

        let (failed_count, join_error, suppressed_errors) = check_result.into_parts();

        let primary_error = join_error.or_else(|| {
            (!suppressed_errors.is_empty()).then(|| ProviderError::check_aggregate(&ctx))
        });
        if let Some(e) = primary_error {
            report_lifecycle_failure(&app, logger, &ctx, run_id.as_str(), &e, &suppressed_errors);
            return;
        }

        complete_provider_check(&app, logger, &ctx, run_id.as_str(), failed_count);
    }
    .instrument(span)
    .await;
}

/// Emits the lifecycle completion event and records or reports the outcome.
///
/// 推送生命周期完成事件，并记录成功或上报失败。
fn complete_provider_check(
    app: &AppHandle,
    logger: &AppLogger,
    ctx: &ProviderLifecycleContext<'_>,
    run_id: &str,
    count: usize,
) {
    match emit_check_completed(app, ctx, run_id, count) {
        Ok(()) => ProviderLogEntry::record_check_completed(logger, ctx),
        Err(e) => report_lifecycle_failure(app, logger, ctx, run_id, &e, &[]),
    }
}
