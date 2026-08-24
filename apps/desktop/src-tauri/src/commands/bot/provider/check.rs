// apps/desktop/src-tauri/src/commands/bot/provider/check.rs
use tauri::{AppHandle, State};

use crate::core::{check_providers_lifecycle, AppState, ProviderCheckTrigger};
use ProviderCheckTrigger::{ManualRefresh, Startup};

/// Triggers provider lifecycle checks after application startup.
///
/// 应用启动后触发供应商生命周期检查。
#[tauri::command]
pub(crate) async fn trigger_provider_startup_check(
    app: AppHandle,
    state: State<'_, AppState>,
) -> Result<(), ()> {
    check_providers_lifecycle(app, state.inner(), Startup).await;
    Ok(())
}

/// Triggers provider lifecycle checks for manual refresh.
///
/// 手动刷新时触发供应商生命周期检查。
#[tauri::command]
pub(crate) async fn trigger_provider_manual_refresh(
    app: AppHandle,
    state: State<'_, AppState>,
) -> Result<(), ()> {
    check_providers_lifecycle(app, state.inner(), ManualRefresh).await;
    Ok(())
}
