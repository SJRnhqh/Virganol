// apps/desktop/src-tauri/src/core/bot/services/settings/provider/manager/update.rs
use log::{info, warn};
use tauri::AppHandle;

use super::super::super::super::super::{
    ProviderState, UpdateEnabledModelsRequest, UpdateEnabledModelsResponse,
};
use super::super::update_models;

/// Updates enabled models for a provider.
///
/// 更新某个 provider 的 enabled_models。
pub(crate) fn update_provider_enabled_models(
    app: &AppHandle,
    _provider_state: &ProviderState,
    request: UpdateEnabledModelsRequest,
) -> UpdateEnabledModelsResponse {
    let UpdateEnabledModelsRequest { provider_id, data } = request;

    match update_models(app, provider_id, data.enabled_models) {
        Ok(true) => {
            info!("[Tauri] ✅ {} enabled_models updated", provider_id);
            UpdateEnabledModelsResponse::success()
        }
        Ok(false) => {
            warn!(
                "[Tauri] ⚠️ {} enabled_models update skipped (provider not found)",
                provider_id
            );
            UpdateEnabledModelsResponse::success()
        }
        Err(e) => UpdateEnabledModelsResponse::failure(e.message()),
    }
}
