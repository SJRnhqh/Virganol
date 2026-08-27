// apps/desktop/src-tauri/src/container/registration.rs
use tauri::{Builder, Wry};

use crate::core::{AppLogger, AppState, SidecarState};
use crate::tmp;

/// Registers the Tauri desktop application extensions and managed states.
///
/// 注册 Tauri 桌面应用扩展和托管状态。
pub(super) fn register(builder: Builder<Wry>, sidecar_manager: SidecarState) -> Builder<Wry> {
    manage_states(register_plugins(builder), sidecar_manager)
}

/// Registers the Tauri desktop application plugins.
///
/// 注册 Tauri 桌面应用插件。
fn register_plugins(builder: Builder<Wry>) -> Builder<Wry> {
    builder
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_store::Builder::new().build())
}

/// Manages the Tauri desktop application states.
///
/// 托管 Tauri 桌面应用状态。
fn manage_states(builder: Builder<Wry>, sidecar_manager: SidecarState) -> Builder<Wry> {
    builder
        .manage(AppLogger)
        .manage(AppState::default())
        .manage(tmp::terminal::TerminalState::default())
        .manage(sidecar_manager)
}
