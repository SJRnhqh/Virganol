// apps/desktop/src-tauri/src/lib.rs
mod core;
mod platform;
mod tmp;

use std::sync::Arc;
use tauri::RunEvent;

use core::manager::{SidecarManager, SidecarState};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 创建 SidecarManager 实例
    let sidecar_manager: SidecarState = Arc::new(SidecarManager::new());
    let manager_for_exit = sidecar_manager.clone();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        // 注册 terminal 状态
        .manage(tmp::terminal::TerminalState::default())
        // 注册 sidecar manager 状态
        .manage(sidecar_manager)
        .setup(|app| {
            #[cfg(target_os = "windows")]
            {
                platform::windows::apply_window_tweaks(app);
            }
            // 初始化 sidecar
            core::init(app.handle());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // SSH 命令
            tmp::ssh::test_ssh_params,
            // PTY 命令
            tmp::terminal::init_pty,
            tmp::terminal::write_pty
        ])
        .build(tauri::generate_context!())
        .expect("Error while building tauri application")
        .run(move |_app_handle, event| {
            // 处理应用退出事件
            if let RunEvent::ExitRequested { .. } = event {
                let manager = manager_for_exit.clone();
                // 在异步运行时中执行shutdown，不阻塞Tauri事件循环
                // 这样UI在退出时保持响应，不会冻结
                tauri::async_runtime::spawn(async move {
                    println!("[Tauri] Exit requested, shutting down sidecar...");
                    let success = manager.shutdown(10000).await;
                    if success {
                        println!("[Tauri] Sidecar shutdown complete");
                    } else {
                        eprintln!("[Tauri] Sidecar shutdown may have failed");
                    }
                });
            }
        });
}
