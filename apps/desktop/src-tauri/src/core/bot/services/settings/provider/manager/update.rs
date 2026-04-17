// apps/desktop/src-tauri/src/core/bot/services/settings/provider/manager/update.rs
// 外部依赖
use log::{info, warn};
use tauri::AppHandle;

// 内部引用
use super::super::super::super::super::{ProviderId, UpdateEnabledModelsResponse};
use super::super::update_models;

/// 更新某个 provider 的 enabled_models（service 层：负责业务日志）
pub(crate) fn update_provider_enabled_models(
    app: &AppHandle,
    provider_id: ProviderId,
    enabled_models: Vec<String>,
) -> UpdateEnabledModelsResponse {
    // 调用 store 层执行实际写入，并在这里统一记录业务结果与持久化错误
    match update_models(app, provider_id, enabled_models) {
        Ok(true) => {
            info!("[Tauri] ✅ {} enabled_models updated", provider_id);
            UpdateEnabledModelsResponse {
                success: true,
                error: None,
            }
        }
        Ok(false) => {
            warn!(
                "[Tauri] ⚠️ {} enabled_models update skipped (provider not found)",
                provider_id
            );
            UpdateEnabledModelsResponse {
                success: true,
                error: None,
            }
        }
        Err(e) => UpdateEnabledModelsResponse {
            success: false,
            error: Some(e.message()),
        },
    }
}
