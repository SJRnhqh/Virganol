// apps/desktop/src-tauri/src/container/logging/retention.rs
use chrono::{Duration, NaiveDate, Utc};
use std::{
    fs::{read_dir, remove_file},
    path::Path,
};

use super::{LOG_FILE_EXT, LOG_FILE_STEM};

/// Number of days that daily JSONL log files are kept before cleanup.
///
/// 每日 JSONL 日志文件的保留天数，超期即清理。
const RETENTION_DAYS: i64 = 14;

/// Removes expired daily JSONL log files from the log directory.
///
/// 从日志目录清除已过期的每日 JSONL 日志文件，按文件名中的 UTC 轮转日期判定过期。
pub(super) fn clean_expired_logs(log_dir: &Path) {
    let cutoff = Utc::now().date_naive() - Duration::days(RETENTION_DAYS);

    for entry in read_dir(log_dir).into_iter().flatten().flatten() {
        let file_name = entry.file_name();
        let Some(name) = file_name.to_str() else {
            continue;
        };
        let Some(date) = name
            .strip_prefix(LOG_FILE_STEM)
            .and_then(|rest| rest.strip_prefix('.'))
            .and_then(|rest| rest.strip_suffix(LOG_FILE_EXT))
            .and_then(|rest| rest.strip_suffix('.'))
        else {
            continue;
        };

        if NaiveDate::parse_from_str(date, "%Y-%m-%d").is_ok_and(|rolled| rolled < cutoff) {
            let _ = remove_file(entry.path());
        }
    }
}
