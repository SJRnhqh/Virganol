// apps/desktop/src-tauri/src/commands/bot/provider/update.rs
use crate::core::AppState;
use tauri::{AppHandle, State};

use crate::core::{
    update_provider_enabled_models, UpdateEnabledModelsRequest, UpdateEnabledModelsResponse,
};

/// Updates the enabled models for a provider.
///
/// 更新 Provider 的已启用模型列表。
#[tauri::command]
pub(crate) async fn update_enabled_models(
    app: AppHandle,
    state: State<'_, AppState>,
    payload: UpdateEnabledModelsRequest,
) -> Result<UpdateEnabledModelsResponse, ()> {
    Ok(update_provider_enabled_models(
        &app,
        &state.provider,
        payload,
    ))
}
