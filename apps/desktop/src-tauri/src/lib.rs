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
            tmp::terminal::write_pty,
            core::commands::verify_llm_config,
            core::commands::set_llm_config,
            core::commands::get_llm_config
        ])
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
