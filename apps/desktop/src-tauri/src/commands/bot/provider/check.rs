// apps/desktop/src-tauri/src/commands/bot/provider/check.rs
use tauri::{command, AppHandle, State};

use crate::core::{
    check_providers_lifecycle, AppLogger, AppState,
    ProviderCheckTrigger::{ManualRefresh, Startup},
};

/// Triggers provider lifecycle checks after application startup.
///
/// 应用启动后触发供应商生命周期检查。
#[command]
pub(crate) async fn trigger_provider_startup_check(
    app: AppHandle,
    logger: State<'_, AppLogger>,
    state: State<'_, AppState>,
) -> Result<(), ()> {
    check_providers_lifecycle(app, logger.inner(), state.inner(), Startup).await;
    Ok(())
}

/// Triggers provider lifecycle checks for manual refresh.
///
/// 手动刷新时触发供应商生命周期检查。
#[command]
pub(crate) async fn trigger_provider_manual_refresh(
    app: AppHandle,
    logger: State<'_, AppLogger>,
    state: State<'_, AppState>,
) -> Result<(), ()> {
    check_providers_lifecycle(app, logger.inner(), state.inner(), ManualRefresh).await;
    Ok(())
}
