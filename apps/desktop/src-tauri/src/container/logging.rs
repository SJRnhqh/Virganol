// apps/desktop/src-tauri/src/container/logging.rs
use std::io::stderr;
use tracing_subscriber::{
    filter::{EnvFilter, LevelFilter},
    fmt,
};

/// Initializes the desktop logging backend.
///
/// 初始化桌面日志后端。
pub(super) fn init_logging() {
    fmt()
        .with_env_filter(
            EnvFilter::builder()
                .with_default_directive(LevelFilter::INFO.into())
                .from_env_lossy(),
        )
        .with_writer(stderr)
        .init();
}
