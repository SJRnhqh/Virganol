// apps/desktop/src-tauri/src/core/bot/services/settings/provider/lifecycle/processor.rs
use log::{error, info};
use tauri::AppHandle;

use super::super::super::super::super::{
    compute_enabled_models, HealthCheckResult, ProviderCheckFinalization, ProviderError,
    ProviderId, ProviderRecord, ProviderState,
};
use super::super::save_provider;

/// 协调 enabled_models：只保留 available_models 中仍然存在的模型
/// 返回：
/// - 最终生效的 ProviderRecord（回写失败时回滚为原 record）
/// - 可选错误信息（用于上层统一收敛 warning/partial_failure）
fn reconcile_enabled_models(
    app: &AppHandle,
    provider_state: &ProviderState,
    provider_id: ProviderId,
    record: &ProviderRecord,
    available_models: &[String],
) -> (ProviderRecord, Option<ProviderError>) {
    // 交集：只保留仍然可用的 enabled 模型
    let new_enabled = compute_enabled_models(&record.enabled_models, available_models);

    if new_enabled.len() != record.enabled_models.len() {
        // 有模型被淘汰了，构造新 record 并写回配置
        let old_len = record.enabled_models.len();
        let mut updated = record.clone();
        updated.enabled_models = new_enabled;

        match save_provider(app, provider_state, provider_id, updated.clone()) {
            Ok(()) => {
                info!(
                    "[Tauri] 🔄 {} enabled_models reconciled: {} → {}",
                    provider_id,
                    old_len,
                    updated.enabled_models.len()
                );
                (updated, None)
            }
            Err(err) => {
                error!(
                    "[Tauri] ❌ {} enabled_models reconcile persist failed: {}",
                    provider_id,
                    err.message()
                );
                (record.clone(), Some(err))
            }
        }
    } else {
        // 无变化，原样返回
        (record.clone(), None)
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
    if health.success {
        let (final_record, reconcile_error) = reconcile_enabled_models(
            app,
            provider_state,
            provider_id,
            &record,
            &health.available_models,
        );
        ProviderCheckFinalization::online(final_record, reconcile_error)
    } else {
        ProviderCheckFinalization::offline(record)
    }
}
