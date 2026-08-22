// dev/scripts/rust/comments/crates/cli/src/error.rs
use std::io::Error as IoError;

use virganol_rust_comment_checker_core::CommentCheckError;

/// Represents an error produced by the comment checker CLI.
///
/// 表示注释检查 CLI 产生的错误。
pub(super) enum CliError {
    /// Command-line arguments are invalid.
    ///
    /// 命令行参数无效。
    Arguments,
    /// Standard input could not be read.
    ///
    /// 无法读取标准输入。
    Stdin,
    /// The comment check failed.
    ///
    /// 注释检查失败。
    Check(
        /// Core comment check error.
        ///
        /// Core 注释检查错误。
        CommentCheckError,
    ),
}

impl AsRef<str> for CliError {
    /// Returns the stable code exposed by the CLI.
    ///
    /// 返回 CLI 暴露的稳定代码。
    fn as_ref(&self) -> &str {
        match self {
            Self::Arguments => "arguments",
            Self::Stdin => "stdin",
            Self::Check(error) => error.as_ref(),
        }
    }
}

impl From<IoError> for CliError {
    /// Creates a standard input error.
    ///
    /// 创建标准输入错误。
    fn from(_: IoError) -> Self {
        Self::Stdin
    }
}

impl From<CommentCheckError> for CliError {
    /// Creates a comment check error.
    ///
    /// 创建注释检查错误。
    fn from(error: CommentCheckError) -> Self {
        Self::Check(error)
    }
}
