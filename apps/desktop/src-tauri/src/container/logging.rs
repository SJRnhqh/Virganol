// apps/desktop/src-tauri/src/container/logging.rs
use env_logger::Builder;
use log::LevelFilter;

/// Initializes the desktop logging backend.
///
/// 初始化桌面日志后端。
pub(super) fn init_logging() {
    Builder::from_default_env()
        .filter_level(LevelFilter::Debug)
        .init();
}
