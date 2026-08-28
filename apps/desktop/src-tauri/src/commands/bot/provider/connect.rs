// apps/desktop/src-tauri/src/commands/bot/provider/connect.rs
use tauri::{command, AppHandle, State};

use crate::core::{
    connect_and_save, AppLogger, AppState, ConnectAndSaveProviderRequest,
    ConnectAndSaveProviderResponse, ProviderAppError,
};

/// Handles provider connection and configuration persistence at the command boundary.
///
/// 在命令边界处理供应商连接与配置持久化。
#[command]
pub(crate) async fn connect_and_save_provider(
    app: AppHandle,
    logger: State<'_, AppLogger>,
    state: State<'_, AppState>,
    payload: ConnectAndSaveProviderRequest,
) -> Result<ConnectAndSaveProviderResponse, ProviderAppError> {
    connect_and_save(&app, logger.inner(), state.inner(), payload).await
}
