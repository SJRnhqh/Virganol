// apps/desktop/src-tauri/src/invoke.rs
use tauri::{generate_handler, Builder, Wry};

use commands::{
    connect_and_save_provider, reset_provider, trigger_provider_manual_refresh,
    trigger_provider_startup_check, update_enabled_models,
};

/// Registers the Tauri command handler.
///
/// 注册 Tauri 命令处理器。
fn register_invoke_handler(builder: Builder<Wry>) -> Builder<Wry> {
    builder.invoke_handler(generate_handler![
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
