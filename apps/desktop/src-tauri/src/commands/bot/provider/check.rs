// apps/desktop/src-tauri/src/commands/bot/provider/check.rs
use tauri::{AppHandle, State};

use crate::core::{check_providers_lifecycle, AppState, ProviderCheckTrigger};

/// Triggers the provider lifecycle check on application startup.
///
/// 应用启动时触发 Provider 生命周期检查。
#[tauri::command]
pub(crate) async fn trigger_provider_startup_check(
    app: AppHandle,
    state: State<'_, AppState>,
) -> Result<(), ()> {
    check_providers_lifecycle(app, state.inner(), ProviderCheckTrigger::Startup).await;
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
    check_providers_lifecycle(app, state.inner(), ProviderCheckTrigger::ManualRefresh).await;
    Ok(())
}
