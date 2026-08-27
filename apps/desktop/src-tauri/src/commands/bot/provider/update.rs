// apps/desktop/src-tauri/src/commands/bot/provider/update.rs
use tauri::{command, AppHandle, State};

use crate::core::{
    update_provider_enabled_models, AppLogger, AppState, ProviderAppError,
    UpdateEnabledModelsRequest, UpdateEnabledModelsResponse,
};

/// Handles enabled model updates at the command boundary.
///
/// 在命令边界处理启用模型更新。
#[command]
pub(crate) async fn update_enabled_models(
    app: AppHandle,
    logger: State<'_, AppLogger>,
    state: State<'_, AppState>,
    payload: UpdateEnabledModelsRequest,
) -> Result<UpdateEnabledModelsResponse, ProviderAppError> {
    update_provider_enabled_models(&app, logger.inner(), state.inner(), payload)
}
