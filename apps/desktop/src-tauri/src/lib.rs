use ssh2::Session;
use std::net::TcpStream;

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

// 1. 引入模块
mod terminal;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .manage(terminal::TerminalState::default())
        .invoke_handler(tauri::generate_handler![
            test_ssh_params,
            terminal::init_pty,
            terminal::write_pty
        ])
        .run(tauri::generate_context!())
        .expect("Error while running tauri application");
}
