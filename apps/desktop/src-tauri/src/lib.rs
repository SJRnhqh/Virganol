// apps/desktop/src-tauri/src/lib.rs

#[tauri::command]
fn greet(name: &str) -> String {
    format!("你好 {}, 信号已收到！", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet]) // 必须在这里注册
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
