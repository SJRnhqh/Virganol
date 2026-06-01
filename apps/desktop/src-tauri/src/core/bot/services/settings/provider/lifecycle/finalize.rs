// apps/desktop/src-tauri/src/core/bot/services/settings/provider/lifecycle/finalize.rs
use log::{error, info};
use tauri::AppHandle;

use super::super::super::super::super::{
    HealthCheckResult, ProviderCheckFinalization, ProviderError, ProviderId, ProviderRecord,
    ProviderState,
};
use super::super::save_provider;

/// Persists a provider record when enabled models are pruned by available models.
///
/// 当 enabled_models 被当前可用模型修剪时，持久化已协调的 Provider 配置。
fn persist_reconciled_enabled_models(
    app: &AppHandle,
    provider_state: &ProviderState,
    provider_id: ProviderId,
    record: ProviderRecord,
    available_models: &[String],
) -> (ProviderRecord, Option<ProviderError>) {
    let Some(updated) = record.reconcile_enabled_models_if_pruned(available_models) else {
        return (record, None);
    };

    let previous_enabled_model_count = record.enabled_models.len();

    match save_provider(app, provider_state, provider_id, updated.clone()) {
        Ok(()) => {
            info!(
                "[Tauri] 🔄 {} enabled_models reconciled: {} → {}",
                provider_id,
                previous_enabled_model_count,
                updated.enabled_models.len()
            );
            (updated, None)
        }
        Err(e) => {
            error!(
                "[Tauri] ❌ {} enabled_models reconcile persist failed: {}",
                provider_id,
                e.message()
            );
            (record, Some(e))
        }
    }
}

/// Finalizes one provider health check result for lifecycle status emission.
///
/// 单个 Provider 健康检查完成后，生成生命周期状态推送前的后处理结果。
pub(super) fn finalize_provider_check_result(
    app: &AppHandle,
    provider_state: &ProviderState,
    provider_id: ProviderId,
    record: ProviderRecord,
    health: &HealthCheckResult,
) -> ProviderCheckFinalization {
    if health.is_success() {
        let (status_record, reconciliation_error) = persist_reconciled_enabled_models(
            app,
            provider_state,
            provider_id,
            record,
            health.available_models(),
        );
        ProviderCheckFinalization::online(status_record, reconciliation_error)
    } else {
        ProviderCheckFinalization::offline(record)
    }
}
