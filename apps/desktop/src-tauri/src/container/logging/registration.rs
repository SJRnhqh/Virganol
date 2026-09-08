// apps/desktop/src-tauri/src/container/logging/registration.rs
use std::error::Error;
use tauri::{App, Manager};
use tracing_subscriber::{layer::SubscriberExt, registry, util::SubscriberInitExt};

use super::{banner_level, clean_expired_logs, console_layer, emit_startup_banner, jsonl_layer};

/// Initializes the desktop logging backend, cleans expired logs, and manages the JSONL flush guard.
///
/// 初始化桌面日志后端，清理过期日志，并托管 JSONL 冲刷守卫。
pub(in crate::container) fn init_logging(app: &mut App) -> Result<(), Box<dyn Error>> {
    let log_dir = app.path().app_log_dir()?;

    clean_expired_logs(&log_dir);

    let (jsonl, guard) = jsonl_layer(&log_dir)?;

    registry().with(console_layer()).with(jsonl).init();

    emit_startup_banner(&log_dir, &banner_level());

    app.manage(guard);

    Ok(())
}
