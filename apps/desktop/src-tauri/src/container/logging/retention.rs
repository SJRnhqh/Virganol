// apps/desktop/src-tauri/src/container/logging/retention.rs
use std::{
    fs::{read_dir, remove_file},
    path::Path,
    time::{Duration, SystemTime},
};

/// Number of days that daily JSONL log files are kept before cleanup.
///
/// 每日 JSONL 日志文件的保留天数,超期即清理。
const RETENTION_DAYS: u64 = 14;

/// Daily rolled JSONL log file prefix matched during cleanup.
///
/// 清理时匹配的每日轮转 JSONL 日志文件前缀。
const LOG_FILE_PREFIX: &str = "virganol.";

/// Daily rolled JSONL log file suffix matched during cleanup.
///
/// 清理时匹配的每日轮转 JSONL 日志文件后缀。
const LOG_FILE_SUFFIX: &str = ".jsonl";

/// Removes expired daily JSONL log files from the log directory.
///
/// 从日志目录清除已过期的每日 JSONL 日志文件。
pub(super) fn clean_expired_logs(log_dir: &Path) {
    let Ok(entries) = read_dir(log_dir) else {
        return;
    };

    let cutoff = SystemTime::now() - Duration::from_secs(RETENTION_DAYS * 24 * 60 * 60);

    for entry in entries.flatten() {
        let path = entry.path();
        if !is_rolled_log_file(&path) {
            continue;
        }

        let Ok(modified) = entry.metadata().and_then(|meta| meta.modified()) else {
            continue;
        };

        if modified < cutoff {
            let _ = remove_file(&path);
        }
    }
}

/// Returns whether the path matches the daily rolled JSONL log naming.
///
/// 判断路径是否符合每日轮转 JSONL 日志命名。
fn is_rolled_log_file(path: &Path) -> bool {
    let Some(name) = path.file_name().and_then(|name| name.to_str()) else {
        return false;
    };

    let Some(date) = name
        .strip_prefix(LOG_FILE_PREFIX)
        .and_then(|stem| stem.strip_suffix(LOG_FILE_SUFFIX))
    else {
        return false;
    };

    let date = date.as_bytes();
    date.len() == 10
        && date[..4].iter().all(u8::is_ascii_digit)
        && date[4] == b'-'
        && date[5..7].iter().all(u8::is_ascii_digit)
        && date[7] == b'-'
        && date[8..].iter().all(u8::is_ascii_digit)
}
