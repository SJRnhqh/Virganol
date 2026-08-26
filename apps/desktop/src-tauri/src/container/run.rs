// apps/desktop/src-tauri/src/container/run.rs
use std::sync::Arc;
use tauri::RunEvent;

use crate::core::{AppLogger, AppState, SidecarManager, SidecarState};
use crate::{core, tmp};

/// Runs the desktop application container.
///
/// 运行桌面应用容器。
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 初始化日志系统
    env_logger::Builder::from_default_env()
        .filter_level(log::LevelFilter::Debug)
        .init();

    // 创建 SidecarManager 实例
    let sidecar_manager: SidecarState = Arc::new(SidecarManager::new());
    let manager_for_exit = sidecar_manager.clone();

    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_store::Builder::new().build()) // 持久化存储
        .manage(AppLogger)
        // 注册 AppState
        .manage(AppState::default())
        // 注册 terminal 状态
        .manage(tmp::terminal::TerminalState::default())
        // 注册 sidecar manager 状态
        .manage(sidecar_manager)
        .setup(|app| {
            #[cfg(target_os = "windows")]
            {
                crate::platform::windows::apply_window_tweaks(app);
            }
            // 初始化 sidecar
            core::init(app.handle());
            Ok(())
        });

    crate::register_invoke_handler(builder)
        .build(tauri::generate_context!())
        .expect("Error while building tauri application")
        .run(move |_app_handle, event| {
            // 处理应用退出事件
            if let RunEvent::ExitRequested { .. } = event {
                let manager = manager_for_exit.clone();
                // 使用 block_on 同步等待 shutdown 完成
                // 这确保在进程退出前 sidecar 被正确清理
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
        });
}
