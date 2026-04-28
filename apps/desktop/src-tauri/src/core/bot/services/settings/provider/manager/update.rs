// apps/desktop/src-tauri/src/core/bot/services/settings/provider/manager/update.rs
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
    provider_state: &ProviderState,
    request: UpdateEnabledModelsRequest,
) -> UpdateEnabledModelsResponse {
    let UpdateEnabledModelsRequest { provider_id, data } = request;

    let Some(payload) = data else {
        return UpdateEnabledModelsResponse::failure("missing data field");
    };

    match update_models(app, provider_state, provider_id, payload.enabled_models) {
        Ok(()) => UpdateEnabledModelsResponse::success(),
        Err(e) => UpdateEnabledModelsResponse::failure(e.message()),
    }
}
