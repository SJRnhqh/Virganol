// apps/desktop/src-tauri/src/container/lifecycle.rs
use tauri::{Builder, RunEvent, Wry};

use super::{apply_window_appearance, init_logging, shutdown_sidecar};
use crate::core::{self, SidecarState};

/// Registers startup initialization for the Tauri desktop application.
///
/// 注册 Tauri 桌面应用启动初始化。
pub(super) fn setup(builder: Builder<Wry>) -> Builder<Wry> {
    builder.setup(|app| {
        init_logging(app)?;
        apply_window_appearance(app);
        core::init(app.handle());
        Ok(())
    })
}

/// Handles Tauri desktop application lifecycle events.
///
/// 处理 Tauri 桌面应用生命周期事件。
pub(super) fn handle_event(event: RunEvent, sidecar_manager: &SidecarState) {
    if let RunEvent::ExitRequested { .. } = event {
        shutdown_sidecar(sidecar_manager);
    }
}
