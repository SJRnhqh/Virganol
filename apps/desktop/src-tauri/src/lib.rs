use ssh2::Session;
use std::net::TcpStream;

#[tauri::command]
async fn test_ssh_params(
    host: String,
    port: String,
    username: String,
    password: String,
) -> Result<String, String> {
    // 2. 动态拼接：使用 host:port
    let addr = format!("{}:{}", host, port);

    let tcp = TcpStream::connect(&addr).map_err(|e| format!("无法连接到 {}: {}", addr, e))?;

    let mut sess = Session::new().map_err(|e| format!("会话初始化失败: {}", e))?;
    sess.set_tcp_stream(tcp);
    sess.handshake()
        .map_err(|e| format!("协议握手失败: {}", e))?;

    sess.userauth_password(&username, &password)
        .map_err(|e| format!("认证异常: {}", e))?;

    if sess.authenticated() {
        Ok(format!("✅ 成功连接到 {} (端口: {})", host, port))
    } else {
        Err("❌ 认证失败".into())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        // 记得在这里注册你的新函数
        .invoke_handler(tauri::generate_handler![test_ssh_params])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
