// apps/desktop/src-tauri/src/core/bot/services/settings/provider/lifecycle/flow.rs
use tauri::AppHandle;
use tracing::Instrument;

use super::super::super::super::super::super::{AppLogger, AppState, LogLevel::Info};
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
        ProviderLogEntry::record_check_started(logger, Info, &ctx);

        if let Some(e) = emit_check_started(&app, &ctx, run_id.as_str(), &trigger).err() {
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
        match providers.as_slice() {
            [] => {
                if let Some(e) =
                    emit_check_completed(&app, &ctx, run_id.as_str(), providers.len()).err()
                {
                    report_lifecycle_failure(&app, logger, &ctx, run_id.as_str(), &e, &[]);
                }
                return;
            }
            _ => {}
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

        if let Err(e) = emit_check_completed(&app, &ctx, run_id.as_str(), failed_count) {
            report_lifecycle_failure(&app, logger, &ctx, run_id.as_str(), &e, &[]);
        }
    }
    .instrument(span)
    .await;
}
