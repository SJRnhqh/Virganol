// apps/desktop/src-tauri/src/lib.rs
// TODO: standardize
mod commands;
mod container;
mod core;
mod platform;
mod tmp;

use commands::{
    connect_and_save_provider, reset_provider, trigger_provider_manual_refresh,
    trigger_provider_startup_check, update_enabled_models,
};

pub use container::run;

fn register_invoke_handler(builder: tauri::Builder<tauri::Wry>) -> tauri::Builder<tauri::Wry> {
    builder.invoke_handler(tauri::generate_handler![
        trigger_provider_startup_check,
        trigger_provider_manual_refresh,
        connect_and_save_provider,
        reset_provider,
        update_enabled_models,
        tmp::ssh::test_ssh_params,
        tmp::terminal::init_pty,
        tmp::terminal::write_pty,
    ])
}
