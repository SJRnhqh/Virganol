use ssh2::Session;
use std::net::TcpStream;
use tauri::Manager; // 👈 必须引入这个，才能使用 get_webview_window

// 1. 引入模块
mod terminal;

#[tauri::command]
async fn test_ssh_params(
    host: String,
    port: String,
    username: String,
    password: String,
) -> Result<String, String> {
    let addr = format!("{}:{}", host, port);

    // 1. Establish TCP Connection
    let tcp = TcpStream::connect(&addr)
        .map_err(|e| format!("TCP Connection failed to {}: {}", addr, e))?;

    // Fix for Windows: Ensure the stream is in blocking mode before handshake
    tcp.set_nonblocking(false)
        .map_err(|e| format!("Failed to set blocking mode: {}", e))?;

    // 2. Initialize SSH Session
    let mut sess =
        Session::new().map_err(|e| format!("SSH Session initialization failed: {}", e))?;

    sess.set_tcp_stream(tcp);

    // 3. Protocol Handshake
    sess.handshake()
        .map_err(|e| format!("SSH handshake failed: {}", e))?;

    // 4. Authentication
    sess.userauth_password(&username, &password)
        .map_err(|e| format!("Authentication error: {}", e))?;

    if sess.authenticated() {
        Ok(format!(
            "Successfully established link to {} on port {}",
            host, port
        ))
    } else {
        Err("Authentication failed: Invalid credentials".into())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .manage(terminal::TerminalState::default())
        // 👇👇👇 核心修改：在此处插入 setup 钩子 👇👇👇
        .setup(|app| {
            #[cfg(target_os = "windows")]
            {
                // 获取主窗口（Tauri 默认 label 为 "main"）
                if let Some(window) = app.get_webview_window("main") {
                    // 1. Windows 上强制去除装饰（去掉白色边框）
                    let _ = window.set_decorations(false);
                    // 2. 开启阴影（避免窗口看起来像贴纸）
                    let _ = window.set_shadow(true);
                }
            }
            Ok(())
        })
        // 👆👆👆 修改结束 👆👆👆
        .invoke_handler(tauri::generate_handler![
            test_ssh_params,
            terminal::init_pty,
            terminal::write_pty
        ])
        .run(tauri::generate_context!())
        .expect("Error while running tauri application");
}