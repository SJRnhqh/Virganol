// apps/desktop/src-tauri/src/container/logging/constants.rs

/// Daily rolled JSONL log file stem shared by the file layer and retention.
///
/// 文件层与保留清理共用的每日轮转 JSONL 日志文件主干名。
pub(super) const LOG_FILE_STEM: &str = "virganol";

/// Daily rolled JSONL log file extension shared by the file layer and retention.
///
/// 文件层与保留清理共用的每日轮转 JSONL 日志文件扩展名。
pub(super) const LOG_FILE_EXT: &str = "jsonl";
