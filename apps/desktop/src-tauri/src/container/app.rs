// apps/desktop/src-tauri/src/container/app.rs
use tauri::{generate_context, Builder};

use super::{handle_event, prepare_sidecar, register, setup};

/// Builds and runs the Tauri desktop application container.
///
/// 构建并运行 Tauri 桌面应用容器。
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let (sidecar_manager, manager_for_exit) = prepare_sidecar();

    let builder = setup(register(Builder::default(), sidecar_manager));

    builder
        .build(generate_context!())
        .expect("Error while building tauri application")
        .run(move |_app_handle, event| handle_event(event, &manager_for_exit));
}
