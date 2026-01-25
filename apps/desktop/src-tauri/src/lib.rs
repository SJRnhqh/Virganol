// apps/desktop/src-tauri/src/lib.rs
mod tmp;
mod platform;
mod core;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        // 使用 tmp::terminal 的状态
        .manage(tmp::terminal::TerminalState::default())
        .setup(|app| {
            #[cfg(target_os = "windows")]
            {
                platform::windows::apply_window_tweaks(app);
            }
            core::sidecar::init(app.handle());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // SSH 命令
            tmp::ssh::test_ssh_params,
            // PTY 命令
            tmp::terminal::init_pty,
            tmp::terminal::write_pty
        ])
        .run(tauri::generate_context!())
        .expect("Error while running tauri application");
}
