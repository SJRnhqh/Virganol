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
    /// Source analysis could not be completed.
    ///
    /// 无法完成源代码分析。
    Analysis(
        /// Concrete source analysis error.
        ///
        /// 具体的源代码分析错误。
        CommentAnalysisError,
    ),
    /// A comment rule rejected the source.
    ///
    /// 注释规则判定源代码不符合要求。
    Rule(
        /// Concrete comment rule error.
        ///
        /// 具体的注释规则错误。
        CommentRuleError,
    ),
}

/// Represents a concrete source analysis error.
///
/// 表示具体的源代码分析错误。
enum CommentAnalysisError {
    /// The source could not be parsed into a syntax tree.
    ///
    /// 无法将源代码解析为语法树。
    Parse,
    /// A syntax tree location could not be resolved in the source.
    ///
    /// 无法在源代码中定位语法树位置。
    Location,
}

/// Represents a concrete comment rule error.
///
/// 表示具体的注释规则错误。
enum CommentRuleError {
    /// A required outer line documentation comment is missing.
    ///
    /// 缺少必需的外部行文档注释。
    Missing,
    /// A comment does not satisfy the rule.
    ///
    /// 注释不符合规则要求。
    Invalid(
        /// Concrete invalid comment error.
        ///
        /// 具体的无效注释错误。
        CommentInvalidError,
    ),
}

/// Represents a concrete invalid comment error.
///
/// 表示具体的无效注释错误。
enum CommentInvalidError {
    /// A documentation comment uses an invalid attribute style.
    ///
    /// 文档注释使用了无效的属性样式。
    DocStyle,
    /// A comment is misplaced relative to its documentation target.
    ///
    /// 注释相对于其文档目标发生错位。
    Misplaced,
    /// A comment candidate is not a documentation comment.
    ///
    /// 注释候选不是文档注释。
    NonDoc,
    /// A comment candidate mixes incompatible comment kinds.
    ///
    /// 注释候选混合了不兼容的注释类型。
    Mixed,
}
