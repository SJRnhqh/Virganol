// apps/desktop/src-tauri/src/container/logging/constants.rs
use tracing_subscriber::filter::LevelFilter;

/// Default severity directive applied by both layers when RUST_LOG is unset.
///
/// 未设置 RUST_LOG 时两层共同应用的默认级别指令。
pub(super) const DEFAULT_LOG_LEVEL: LevelFilter = LevelFilter::INFO;

/// Daily rolled JSONL log file stem shared by the file layer and retention.
///
/// 文件层与保留清理共用的每日轮转 JSONL 日志文件主干名。
pub(super) const LOG_FILE_STEM: &str = "virganol";

/// Daily rolled JSONL log file extension shared by the file layer and retention.
///
/// 文件层与保留清理共用的每日轮转 JSONL 日志文件扩展名。
pub(super) const LOG_FILE_EXT: &str = "jsonl";

/// Startup banner art rows spelling the brand name, rendered from the ANSI Shadow font.
///
/// 启动横幅的品牌名称艺术字行，由 ANSI 阴影字体渲染。
pub(super) const BANNER_ART: [&str; 6] = [
    "██╗   ██╗██╗██████╗  ██████╗  █████╗ ███╗   ██╗ ██████╗ ██╗",
    "██║   ██║██║██╔══██╗██╔════╝ ██╔══██╗████╗  ██║██╔═══██╗██║",
    "██║   ██║██║██████╔╝██║  ███╗███████║██╔██╗ ██║██║   ██║██║",
    "╚██╗ ██╔╝██║██╔══██╗██║   ██║██╔══██║██║╚██╗██║██║   ██║██║",
    " ╚████╔╝ ██║██║  ██║╚██████╔╝██║  ██║██║ ╚████║╚██████╔╝███████╗",
    "  ╚═══╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝",
];
