// apps/desktop/src-tauri/src/core/settings/bot/providers/lifecycle/processor.rs
// 外部依赖
use log::{error, info};
use tauri::AppHandle;

// 内部引用
use crate::core::models::provider::error::ProviderError;
use crate::core::models::provider::ProviderId;
use crate::core::models::settings::{HealthCheckResponse, ProviderRecord};
use crate::core::settings::bot::providers::store::save_provider;
use crate::core::settings::bot::providers::utils::compute_enabled_models;

/// 协调 enabled_models：只保留 available_models 中仍然存在的模型
/// 返回：
/// - 最终生效的 ProviderRecord（回写失败时回滚为原 record）
/// - 可选错误信息（用于上层统一收敛 warning/partial_failure）
fn reconcile_enabled_models(
    app: &AppHandle,
    provider_id: ProviderId,
    record: &ProviderRecord,
    available_models: &[String],
) -> (ProviderRecord, Option<ProviderError>) {
    // 交集：只保留仍然可用的 enabled 模型
    let new_enabled = compute_enabled_models(&record.enabled_models, available_models);

    if new_enabled.len() != record.enabled_models.len() {
        // 有模型被淘汰了，构造新 record 并写回配置
        let mut updated = record.clone();
        updated.enabled_models = new_enabled;

        match save_provider(app, provider_id, &updated) {
            Ok(()) => {
                info!(
                    "[Tauri] 🔄 {} enabled_models reconciled: {} → {}",
                    provider_id,
                    record.enabled_models.len(),
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

/// 处理单个 provider 检查结果：成功时先做 enabled_models 对齐
/// 返回：
/// - final_record: 最终用于状态推送的配置
/// - online: 健康检查是否成功
/// - reconcile_error: enabled_models 回写失败时的可选错误
pub(super) fn process_provider_check_result(
    app: &AppHandle,
    provider_id: ProviderId,
    record: ProviderRecord,
    health: &HealthCheckResponse,
) -> (ProviderRecord, bool, Option<ProviderError>) {
    let online = health.success;

    if online {
        let (final_record, reconcile_error) =
            reconcile_enabled_models(app, provider_id, &record, &health.available_models);
        // TODO: reconcile_error 会被上层推入 provider_issues 进而触发 lifecycle_failed，
        // 但此时 provider 本身 online，仅模型列表写盘失败。是否应降级为 warn 而非终止生命周期，语义待确认。
        (final_record, true, reconcile_error)
    } else {
        (record, false, None)
    }
}
