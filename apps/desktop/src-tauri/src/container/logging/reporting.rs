// apps/desktop/src-tauri/src/container/logging/reporting.rs
use std::io::{Error, Result, Write};

/// Wraps the JSONL file writer and reports the first write failure to stderr.
///
/// 包装 JSONL 文件写入器,并在首次写入失败时向标准错误流报警。
pub(super) struct ReportingWriter<W> {
    /// The wrapped file writer.
    ///
    /// 被包装的文件写入器。
    inner: W,
    /// Whether the first write failure has already been reported.
    ///
    /// 首次写入失败是否已经报警。
    reported: bool,
}

impl<W> ReportingWriter<W> {
    /// Creates a reporting wrapper around the given writer.
    ///
    /// 为给定写入器创建报警包装。
    pub(super) fn new(inner: W) -> Self {
        Self {
            inner,
            reported: false,
        }
    }

    /// Reports the first write failure to stderr and passes the error through.
    ///
    /// 首次写入失败时向标准错误流报警,并将错误原样透传。
    fn report(&mut self, error: Error) -> Error {
        if !self.reported {
            eprintln!("JSONL log write failed: {error}; file logging is interrupted");
            self.reported = true;
        }
        error
    }
}

impl<W: Write> Write for ReportingWriter<W> {
    /// Writes a buffer and reports the first inner write failure.
    ///
    /// 写入缓冲区,并在内部首次写入失败时报警。
    fn write(&mut self, buf: &[u8]) -> Result<usize> {
        self.inner.write(buf).map_err(|error| self.report(error))
    }

    /// Flushes the inner writer and reports the first flush failure.
    ///
    /// 冲刷内部写入器,并在首次冲刷失败时报警。
    fn flush(&mut self) -> Result<()> {
        self.inner.flush().map_err(|error| self.report(error))
    }
}
