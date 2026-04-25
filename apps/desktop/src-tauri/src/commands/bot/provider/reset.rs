// apps/desktop/src-tauri/src/commands/bot/provider/reset.rs
use tauri::AppHandle;

use crate::core::{reset_provider_config, ResetProviderRequest, ResetProviderResponse};

/// Resets a provider by removing its configuration.
///
/// 重置 Provider，移除其配置。
#[tauri::command]
pub(crate) async fn reset_provider(
    app: AppHandle,
    payload: ResetProviderRequest,
) -> ResetProviderResponse {
    reset_provider_config(&app, payload)
}
