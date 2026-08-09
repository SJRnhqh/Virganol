// dev/scripts/rust/comments/crates/core/src/models/region.rs
use ra_ap_rustc_lexer::TokenKind;

/// Represents the relevant part of a leading source region.
///
/// 描述分析后的先导源代码区域中与目标相关的部分。
pub(crate) enum LeadingRegion {
    /// Uses content on the anchor line.
    ///
    /// 使用锚点同行的内容。
    Inline(
        /// Nearest token kind before the anchor.
        ///
        /// 锚点前最近的词法单元类型。
        TokenKind,
    ),
    /// Uses content before the anchor line.
    ///
    /// 使用锚点所在行之前的内容。
    PreviousLines {
        /// Byte offset where the relevant region begins.
        ///
        /// 相关区域开始处的字节位置。
        start: usize,
    },
}

/// Tracks leading region membership during token analysis.
///
/// 跟踪词法单元是否属于目标的先导区域。
pub(crate) enum LeadingRegionState {
    /// Includes tokens in the leading region.
    ///
    /// 将词法单元纳入先导区域。
    Leading,
    /// Excludes code and trailing comments until a newline.
    ///
    /// 排除代码及尾随注释，直到遇到换行。
    Pending,
}
