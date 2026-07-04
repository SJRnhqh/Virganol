// apps/desktop/src-tauri/src/commands/bot/provider/reset.rs
use tauri::{AppHandle, State};

use crate::core::{
    reset_provider_config, AppState, ProviderAppError, ResetProviderRequest, ResetProviderResponse,
};

/// Handles provider reset at the command boundary.
///
/// 在命令边界处理供应商重置。
#[tauri::command]
pub(crate) async fn reset_provider(
    app: AppHandle,
    state: State<'_, AppState>,
    payload: ResetProviderRequest,
) -> Result<ResetProviderResponse, ProviderAppError> {
    reset_provider_config(&app, state.inner(), payload)
}
