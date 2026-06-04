// apps/desktop/src-tauri/src/commands/bot/provider/connect.rs
use tauri::{AppHandle, State};

use crate::core::{
    connect_and_save, AppState, ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse,
};

/// Connects to a provider and saves the configuration if health check succeeds.
///
/// 连接 Provider 并在健康检查成功后持久化配置。
#[tauri::command]
pub(crate) async fn connect_and_save_provider(
    app: AppHandle,
    state: State<'_, AppState>,
    payload: ConnectAndSaveProviderRequest,
) -> Result<ConnectAndSaveProviderResponse, ()> {
    Ok(connect_and_save(&app, state.inner(), payload).await)
}
