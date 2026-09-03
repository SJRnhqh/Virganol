// apps/desktop/src-tauri/src/container/logging/registration.rs
use tauri::{App, Manager};
use tracing_subscriber::{layer::SubscriberExt, registry, util::SubscriberInitExt};

use super::{console_layer, jsonl_layer};

/// Initializes the desktop logging backend and manages the JSONL flush guard.
///
/// 初始化桌面日志后端并托管 JSONL 冲刷守卫。
pub(in crate::container) fn init_logging(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    let (jsonl, guard) = jsonl_layer(app.path().app_log_dir()?)?;

    registry().with(console_layer()).with(jsonl).init();

    app.manage(guard);

    Ok(())
}
