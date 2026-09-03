// apps/desktop/src-tauri/src/container/logging/retention.rs
use std::{
    fs::{read_dir, remove_file},
    path::Path,
    time::{Duration, SystemTime},
};

use super::{LOG_FILE_EXT, LOG_FILE_STEM};

/// Number of days that daily JSONL log files are kept before cleanup.
///
/// 每日 JSONL 日志文件的保留天数,超期即清理。
const RETENTION_DAYS: u64 = 14;

/// Removes expired daily JSONL log files from the log directory.
///
/// 从日志目录清除已过期的每日 JSONL 日志文件。
pub(super) fn clean_expired_logs(log_dir: &Path) {
    let cutoff = SystemTime::now() - Duration::from_secs(RETENTION_DAYS * 86_400);

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

        let bytes = date.as_bytes();
        let rolled = bytes.len() == 10
            && bytes[4] == b'-'
            && bytes[7] == b'-'
            && bytes
                .iter()
                .enumerate()
                .all(|(index, byte)| index == 4 || index == 7 || byte.is_ascii_digit());

        let expired = rolled
            && entry
                .metadata()
                .and_then(|meta| meta.modified())
                .is_ok_and(|modified| modified < cutoff);
        if expired {
            let _ = remove_file(entry.path());
        }
    }
}
