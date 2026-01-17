#[tauri::command]
fn test_ssh_params(host: &str, username: &str, password: &str) -> String {
    // 打印参数，说明我们已经拿到了数据
    println!(
        "接收到连接请求: {}, 用户: {}, 密码长度: {}",
        host,
        username,
        password.len()
    );

    format!(
        "--- [Virganol Log] ---\nTarget: {}\nUser: {}\nStatus: Identity confirmed (Pass len: {}). Ready to mount SSH2 crate.",
        host, username, password.len() // 这里使用了 password
    )
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![test_ssh_params])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
