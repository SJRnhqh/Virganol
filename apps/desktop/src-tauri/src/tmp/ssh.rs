// apps/desktop/src-tauri/src/tmp/ssh.rs
use ssh2::Session;
use std::net::TcpStream;

#[tauri::command]
pub async fn test_ssh_params(
    host: String,
    port: String,
    username: String,
    password: String,
) -> Result<String, String> {
    let addr = format!("{}:{}", host, port);

    let tcp = TcpStream::connect(&addr)
        .map_err(|e| format!("TCP Connection failed to {}: {}", addr, e))?;

    // Windows: 阻塞模式更稳定
    tcp.set_nonblocking(false)
        .map_err(|e| format!("Failed to set blocking mode: {}", e))?;

    let mut sess =
        Session::new().map_err(|e| format!("SSH Session initialization failed: {}", e))?;

    sess.set_tcp_stream(tcp);

    sess.handshake()
        .map_err(|e| format!("SSH handshake failed: {}", e))?;

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
