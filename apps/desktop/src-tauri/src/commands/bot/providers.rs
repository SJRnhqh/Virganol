// apps/desktop/src-tauri/src/commands/bot/providers.rs
use tauri::AppHandle;

use crate::core::{
    check_providers_lifecycle, connect_and_save, reset_provider_config,
    ConnectAndSaveProviderRequest, ConnectAndSaveProviderResponse, ProviderCheckTrigger,
    ProviderId, ResetProviderResponse,
};

/// Triggers the provider lifecycle check on application startup.
///
/// 应用启动时触发 Provider 生命周期检查。
#[tauri::command]
pub(crate) async fn trigger_provider_startup_check(app: AppHandle) {
    check_providers_lifecycle(app, ProviderCheckTrigger::Startup).await;
}

/// Triggers the provider lifecycle check on manual refresh.
///
/// 手动刷新时触发 Provider 生命周期检查。
#[tauri::command]
pub(crate) async fn trigger_provider_manual_refresh(app: AppHandle) {
    check_providers_lifecycle(app, ProviderCheckTrigger::ManualRefresh).await;
}

/// Connects to a provider and saves the configuration if health check succeeds.
///
/// 连接 Provider 并在健康检查成功后持久化配置。
#[tauri::command]
pub(crate) async fn connect_and_save_provider(
    app: AppHandle,
    payload: ConnectAndSaveProviderRequest,
) -> ConnectAndSaveProviderResponse {
    let url = payload.url.as_deref().unwrap_or("");
    connect_and_save(&app, payload.provider_id, &payload.key, url).await
}

/// Resets a provider by removing its configuration.
///
/// 重置 Provider，移除其配置。
#[tauri::command]
pub(crate) async fn reset_provider(
    app: AppHandle,
    provider_id: ProviderId,
) -> ResetProviderResponse {
    reset_provider_config(&app, provider_id)
}
