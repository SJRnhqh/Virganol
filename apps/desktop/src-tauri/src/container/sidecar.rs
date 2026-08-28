// apps/desktop/src-tauri/src/container/sidecar.rs
use std::sync::Arc;

use crate::core::{SidecarManager, SidecarState};

/// Prepares shared sidecar manager handles for application state and shutdown.
///
/// 为应用状态和退出清理准备共享边车管理器句柄。
pub(super) fn prepare_sidecar() -> (SidecarState, SidecarState) {
    let manager = Arc::new(SidecarManager::new());
    let manager_for_exit = manager.clone();

    (manager, manager_for_exit)
}

/// Shuts down the sidecar before application exit.
///
/// 在应用退出前关闭边车。
pub(super) fn shutdown_sidecar(manager: &SidecarState) {
    let manager = manager.clone();

    tauri::async_runtime::block_on(async move {
        println!("[Tauri] Exit requested, shutting down sidecar...");
        let success = manager.shutdown(5000).await;
        if success {
            println!("[Tauri] Sidecar shutdown complete");
        } else {
            eprintln!("[Tauri] Sidecar shutdown may have failed");
        }
    });
}
