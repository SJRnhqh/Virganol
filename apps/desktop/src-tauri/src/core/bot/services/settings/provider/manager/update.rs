// apps/desktop/src-tauri/src/core/bot/services/settings/provider/manager/update.rs
use tauri::AppHandle;

use super::super::super::super::super::super::AppState;
use super::super::super::super::super::{UpdateEnabledModelsRequest, UpdateEnabledModelsResponse};
use super::super::update_models;

/// Updates enabled models for a provider.
///
/// 更新某个 provider 的 enabled_models。
pub(crate) fn update_provider_enabled_models(
    app: &AppHandle,
    state: &AppState,
    request: UpdateEnabledModelsRequest,
) -> UpdateEnabledModelsResponse {
    let UpdateEnabledModelsRequest { provider_id, data } = request;
    let provider_state = state.provider();

    let Some(payload) = data else {
        return UpdateEnabledModelsResponse::failure("missing data field");
    };

    match update_models(
        app,
        provider_state,
        provider_id,
        payload.into_enabled_models(),
    ) {
        Ok(()) => UpdateEnabledModelsResponse::success(),
        Err(e) => UpdateEnabledModelsResponse::failure(e.message()),
    }
}
