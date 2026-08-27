// apps/desktop/src-tauri/src/container/windows/appearance.rs
use tauri::App;

/// Applies the Windows-specific appearance to the main Tauri window.
///
/// 为 Tauri 主窗口应用 Windows 专属外观。
pub(in crate::container) fn apply_window_appearance(_app: &App) {
    #[cfg(target_os = "windows")]
    {
        use tauri::Manager as _;

        if let Some(window) = _app.get_webview_window("main") {
            let _ = window.set_decorations(false);
            let _ = window.set_shadow(true);
        }
    }
}
