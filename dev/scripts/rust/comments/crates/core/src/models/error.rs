// dev/scripts/rust/comments/crates/core/src/models/error.rs

/// Represents an error produced while checking Rust comments.
///
/// 表示检查 Rust 注释时产生的错误。
pub struct CommentCheckError {
    /// Stable machine-readable error classification.
    ///
    /// 稳定且可供机器读取的错误分类。
    code: CommentCheckErrorCode,
}

/// Classifies an error produced while checking Rust comments.
///
/// 对检查 Rust 注释时产生的错误进行分类。
enum CommentCheckErrorCode {
    /// The source could not be parsed for checking.
    ///
    /// 无法解析待检查的源代码。
    Parse,
    /// A comment rule rejected the source.
    ///
    /// 注释规则判定源代码不符合要求。
    Rule(CommentRuleErrorCode),
}

/// Classifies a comment rule error.
///
/// 对注释规则错误进行分类。
enum CommentRuleErrorCode {
    /// A required outer line documentation comment is missing.
    ///
    /// 缺少必需的外部行文档注释。
    Missing,
}
