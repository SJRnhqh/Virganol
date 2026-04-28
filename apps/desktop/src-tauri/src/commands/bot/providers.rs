// apps/desktop/src-tauri/src/commands/bot/providers.rs
use tauri::{AppHandle, State};

use crate::core::{
    check_providers_lifecycle, connect_and_save, AppState, ConnectAndSaveProviderRequest,
    ConnectAndSaveProviderResponse, ProviderCheckTrigger,
};

/// Triggers the provider lifecycle check on application startup.
///
/// 应用启动时触发 Provider 生命周期检查。
#[tauri::command]
pub(crate) async fn trigger_provider_startup_check(
    app: AppHandle,
    state: State<'_, AppState>,
) -> Result<(), ()> {
    check_providers_lifecycle(app, &state.provider, ProviderCheckTrigger::Startup).await;
    Ok(())
}

/// Triggers the provider lifecycle check on manual refresh.
///
/// 手动刷新时触发 Provider 生命周期检查。
#[tauri::command]
pub(crate) async fn trigger_provider_manual_refresh(
    app: AppHandle,
    state: State<'_, AppState>,
) -> Result<(), ()> {
    check_providers_lifecycle(app, &state.provider, ProviderCheckTrigger::ManualRefresh).await;
    Ok(())
}

/// Connects to a provider and saves the configuration if health check succeeds.
///
/// 连接 Provider 并在健康检查成功后持久化配置。
#[tauri::command]
pub(crate) async fn connect_and_save_provider(
    app: AppHandle,
    state: State<'_, AppState>,
    payload: ConnectAndSaveProviderRequest,
) -> Result<ConnectAndSaveProviderResponse, ()> {
    let url = payload.url.as_deref().unwrap_or("");
    Ok(connect_and_save(
        &app,
        &state.provider,
        payload.provider_id,
        &payload.key,
        url,
    )
    .await)
}
