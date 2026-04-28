// apps/desktop/src-tauri/src/commands/bot/provider/reset.rs
use tauri::{AppHandle, State};

use crate::core::{reset_provider_config, AppState, ResetProviderRequest, ResetProviderResponse};

/// Resets a provider by removing its configuration.
///
/// 重置 Provider，移除其配置。
#[tauri::command]
pub(crate) async fn reset_provider(
    app: AppHandle,
    state: State<'_, AppState>,
    payload: ResetProviderRequest,
) -> Result<ResetProviderResponse, ()> {
    Ok(reset_provider_config(&app, &state.provider, payload))
}
