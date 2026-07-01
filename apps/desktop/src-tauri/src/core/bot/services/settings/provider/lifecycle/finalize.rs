// apps/desktop/src-tauri/src/core/bot/services/settings/provider/lifecycle/finalize.rs
use log::info;
use tauri::AppHandle;

use super::super::super::super::super::{
    HealthCheckResult, ProviderCheckFinalization, ProviderError, ProviderId,
    ProviderLifecycleContext, ProviderRecord, ProviderState,
};
use super::super::save_provider;

/// Persists a provider record when enabled models are pruned by available models.
///
/// 当已启用模型被当前可用模型修剪时，持久化已协调的供应商配置。
fn persist_reconciled_enabled_models(
    app: &AppHandle,
    provider_state: &ProviderState,
    ctx: &ProviderLifecycleContext,
    provider_id: ProviderId,
    record: ProviderRecord,
    available_models: &[String],
) -> (ProviderRecord, Option<ProviderError>) {
    let Some(updated) = record.reconcile_enabled_models_if_pruned(available_models) else {
        return (record, None);
    };

    let previous_enabled_model_count = record.enabled_models().len();

    let save_result = {
        let ctx = ctx
            .for_config_store()
            .into_execution_context_with(provider_id.into());
        save_provider(app, provider_state, &ctx, provider_id, updated.clone())
    };

    match save_result {
        Ok(()) => {
            info!(
                "[Tauri] 🔄 {} enabled_models reconciled: {} → {}",
                provider_id,
                previous_enabled_model_count,
                updated.enabled_models().len()
            );
            (updated, None)
        }
        Err(e) => (record, Some(e)),
    }
}

/// Finalizes one provider health check result for lifecycle status emission.
///
/// 单个供应商健康检查完成后，生成生命周期状态推送前的后处理结果。
pub(super) fn finalize_provider_check_result(
    app: &AppHandle,
    provider_state: &ProviderState,
    ctx: &ProviderLifecycleContext,
    provider_id: ProviderId,
    record: ProviderRecord,
    health: &HealthCheckResult,
) -> ProviderCheckFinalization {
    if health.is_success() {
        let (status_record, reconciliation_error) = persist_reconciled_enabled_models(
            app,
            provider_state,
            ctx,
            provider_id,
            record,
            health.available_models(),
        );
        ProviderCheckFinalization::online(status_record, reconciliation_error)
    } else {
        ProviderCheckFinalization::offline(record)
    }
}
