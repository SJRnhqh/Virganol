// apps/desktop/src-tauri/src/platform/windows.rs
// TODO: standardize
use tauri::{App, Manager as _};

pub fn apply_window_tweaks(app: &App) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.set_decorations(false);
        let _ = window.set_shadow(true);
    }
}
