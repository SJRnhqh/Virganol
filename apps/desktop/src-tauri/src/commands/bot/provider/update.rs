// apps/desktop/src-tauri/src/commands/bot/provider/update.rs
use tauri::{AppHandle, State};

use crate::core::{
    update_provider_enabled_models, AppState, ProviderAppError, UpdateEnabledModelsRequest,
    UpdateEnabledModelsResponse,
};

/// Handles enabled model updates at the command boundary.
///
/// 在命令边界处理启用模型更新。
#[tauri::command]
pub(crate) async fn update_enabled_models(
    app: AppHandle,
    state: State<'_, AppState>,
    payload: UpdateEnabledModelsRequest,
) -> Result<UpdateEnabledModelsResponse, ProviderAppError> {
    update_provider_enabled_models(&app, state.inner(), payload)
}
