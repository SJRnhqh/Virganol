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
    let data = payload.data.unwrap_or_else(|| {
        panic!("connect_and_save_provider: missing data field");
    });
    let url = data.url.as_deref().unwrap_or("");
    Ok(connect_and_save(&app, &state.provider, payload.provider_id, &data.key, url).await)
}
