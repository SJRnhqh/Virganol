// apps/desktop/src-tauri/src/container/logging/registration.rs
use std::path::PathBuf;
use tracing_appender::rolling::InitError;
use tracing_subscriber::{layer::SubscriberExt, registry, util::SubscriberInitExt};

use super::{console_layer, jsonl_layer};

/// Initializes the desktop logging backend.
///
/// 初始化桌面日志后端。
pub(in crate::container) fn init_logging(log_dir: PathBuf) -> Result<(), InitError> {
    registry()
        .with(console_layer())
        .with(jsonl_layer(log_dir)?)
        .init();

    Ok(())
}
