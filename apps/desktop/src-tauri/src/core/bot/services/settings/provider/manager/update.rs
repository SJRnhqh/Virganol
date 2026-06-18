// apps/desktop/src-tauri/src/core/bot/services/settings/provider/manager/update.rs
use tauri::AppHandle;

use super::super::super::super::super::super::AppState;
use super::super::super::super::super::{
    ProviderAppError, ProviderError, UpdateEnabledModelsRequest, UpdateEnabledModelsResponse,
};
use super::super::update_models;

/// Updates enabled models for a provider.
///
/// 更新某个 provider 的 enabled_models。
pub(crate) fn update_provider_enabled_models(
    app: &AppHandle,
    state: &AppState,
    request: UpdateEnabledModelsRequest,
) -> UpdateEnabledModelsResponse {
    let (provider_id, data) = request.into_parts();
    let provider_state = state.provider();

    let data = match data {
        Some(data) => data,
        None => {
            let e = ProviderError::ManagerRequestPayloadAbsent(
                "provider manager request payload is absent".to_string(),
            );
            return UpdateEnabledModelsResponse::failure(ProviderAppError::with_provider_id(
                &e,
                provider_id,
            ));
        }
    };

    match update_models(app, provider_state, provider_id, data.into_enabled_models()) {
        Ok(()) => UpdateEnabledModelsResponse::success(),
        Err(e) => UpdateEnabledModelsResponse::failure(ProviderAppError::with_provider_id(
            &e,
            provider_id,
        )),
    }
}
