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

impl CommentCheckError {
    /// Creates a source parsing error.
    ///
    /// 创建源代码解析错误。
    pub(crate) fn parse() -> Self {
        Self::analysis(CommentAnalysisError::Parse)
    }

    /// Creates a source location error.
    ///
    /// 创建源代码定位错误。
    pub(crate) fn location() -> Self {
        Self::analysis(CommentAnalysisError::Location)
    }

    /// Creates a source analysis result mismatch error.
    ///
    /// 创建源代码分析结果不匹配错误。
    pub(crate) fn mismatch() -> Self {
        Self::analysis(CommentAnalysisError::Mismatch)
    }

    /// Creates an analysis pattern error.
    ///
    /// 创建分析模式错误。
    pub(crate) fn pattern() -> Self {
        Self::analysis(CommentAnalysisError::Pattern)
    }

    /// Creates a missing documentation comment error.
    ///
    /// 创建文档注释缺失错误。
    pub(crate) fn missing() -> Self {
        Self::rule(CommentRuleError::Missing)
    }

    /// Creates an invalid documentation style error.
    ///
    /// 创建文档注释样式无效错误。
    pub(crate) fn invalid_doc_style() -> Self {
        Self::invalid(CommentInvalidError::DocStyle)
    }

    /// Creates a misplaced comment error.
    ///
    /// 创建注释错位错误。
    pub(crate) fn misplaced() -> Self {
        Self::invalid(CommentInvalidError::Misplaced)
    }

    /// Creates a non-documentation comment error.
    ///
    /// 创建非文档注释错误。
    pub(crate) fn non_doc() -> Self {
        Self::invalid(CommentInvalidError::NonDoc)
    }

    /// Creates a mixed comment error.
    ///
    /// 创建混杂注释错误。
    pub(crate) fn mixed() -> Self {
        Self::invalid(CommentInvalidError::Mixed)
    }

    /// Creates a source analysis error.
    ///
    /// 创建源代码分析错误。
    fn analysis(error: CommentAnalysisError) -> Self {
        Self {
            code: CommentCheckErrorCode::Analysis(error),
        }
    }

    /// Creates a comment rule error.
    ///
    /// 创建注释规则错误。
    fn rule(error: CommentRuleError) -> Self {
        Self {
            code: CommentCheckErrorCode::Rule(error),
        }
    }

    /// Creates an invalid comment error.
    ///
    /// 创建无效注释错误。
    fn invalid(error: CommentInvalidError) -> Self {
        Self::rule(CommentRuleError::Invalid(error))
    }
}

impl AsRef<str> for CommentCheckError {
    /// Returns the stable code exposed across adapter boundaries.
    ///
    /// 返回跨适配器边界暴露的稳定代码。
    fn as_ref(&self) -> &str {
        match &self.code {
            CommentCheckErrorCode::Analysis(CommentAnalysisError::Parse) => "parse",
            CommentCheckErrorCode::Analysis(CommentAnalysisError::Location) => "location",
            CommentCheckErrorCode::Analysis(CommentAnalysisError::Mismatch) => "mismatch",
            CommentCheckErrorCode::Analysis(CommentAnalysisError::Pattern) => "pattern",
            CommentCheckErrorCode::Rule(CommentRuleError::Missing) => "missing",
            CommentCheckErrorCode::Rule(CommentRuleError::Invalid(
                CommentInvalidError::DocStyle,
            )) => "doc-style",
            CommentCheckErrorCode::Rule(CommentRuleError::Invalid(
                CommentInvalidError::Misplaced,
            )) => "misplaced",
            CommentCheckErrorCode::Rule(CommentRuleError::Invalid(CommentInvalidError::NonDoc)) => {
                "non-doc"
            }
            CommentCheckErrorCode::Rule(CommentRuleError::Invalid(CommentInvalidError::Mixed)) => {
                "mixed"
            }
        }
    }
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
    /// Independently derived source analysis results do not agree.
    ///
    /// 独立得出的源代码分析结果彼此不一致。
    Mismatch,
    /// An analysis pattern could not be initialized.
    ///
    /// 无法初始化分析模式。
    Pattern,
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
