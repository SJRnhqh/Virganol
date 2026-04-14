// apps/desktop/src-tauri/src/core/bot/services/settings/provider/manager/update.rs
// 外部依赖
use log::{error, info, warn};
use tauri::AppHandle;

// 内部引用
use super::super::update_models;
use crate::core::bot::models::ProviderId;

/// 更新某个 provider 的 enabled_models（service 层：负责业务日志）
pub(crate) fn update_provider_enabled_models(
    app: &AppHandle,
    provider_id: ProviderId,
    enabled_models: Vec<String>,
) -> bool {
    // 调用 store 层执行实际写入，并在这里统一记录业务结果与持久化错误
    match update_models(app, provider_id, enabled_models) {
        Ok(true) => {
            info!("[Tauri] ✅ {} enabled_models updated", provider_id);
            true
        }
        Ok(false) => {
            warn!(
                "[Tauri] ⚠️ {} enabled_models update skipped (provider not found)",
                provider_id
            );
            false
        }
        Err(e) => {
            error!(
                "[Tauri] ❌ {} enabled_models persist failed: {}",
                provider_id,
                e.message()
            );
            false
        }
    }
}
