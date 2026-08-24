// dev/scripts/rust/comments/crates/core/src/models/region.rs
use ra_ap_rustc_lexer::{
    tokenize,
    FrontmatterAllowed::No,
    TokenKind::{self, BlockComment, LineComment, Whitespace},
};

use self::{
    LeadingRegion::{Inline, PreviousLines},
    LeadingRegionScanState::{Leading, Pending},
};

/// Describes how a comment region reaches its anchor.
///
/// 描述注释区域如何连接其锚点。
pub(crate) enum LeadingRegion {
    /// Uses content on the anchor line.
    ///
    /// 使用锚点同行的内容。
    Inline(
        /// Ordered non-whitespace token kinds before the anchor.
        ///
        /// 锚点前有序排列的非空白词法单元类型。
        Vec<TokenKind>,
    ),
    /// Uses content before the anchor line only.
    ///
    /// 仅使用锚点所在行之前的内容。
    PreviousLines,
}

impl LeadingRegion {
    /// Locates the candidate comment region and its layout in an anchor prefix.
    ///
    /// 在锚点前缀中定位候选注释区域及其布局。
    pub(crate) fn from_anchor_prefix(prefix: &str) -> (usize, Self) {
        let (_, _, comment_region_start, kinds) = tokenize(prefix, No).fold(
            (0, Leading, 0, Vec::new()),
            |(cursor, mut state, mut comment_region_start, mut kinds), token| {
                let token_end = cursor + token.len as usize;
                let newline_offset = match prefix[cursor..token_end].find('\n') {
                    Some(offset) => {
                        kinds.clear();
                        Some(offset)
                    }
                    None => None,
                };

                kinds.push(token.kind);

                match (&mut state, token.kind) {
                    (state @ Pending, Whitespace) => {
                        if let Some(newline_offset) = newline_offset {
                            comment_region_start = cursor + newline_offset + 1;
                            *state = Leading;
                        }
                    }
                    (Pending, LineComment { .. } | BlockComment { .. }) => {}
                    (Leading, Whitespace | LineComment { .. } | BlockComment { .. }) => {}
                    _ => {
                        comment_region_start = token_end;
                        state = Pending;
                    }
                }

                (token_end, state, comment_region_start, kinds)
            },
        );

        (comment_region_start, Self::from_kinds(kinds))
    }

    /// Constructs a layout from ordered anchor-line token kinds.
    ///
    /// 根据锚点同行的有序词法单元类型构造布局。
    fn from_kinds(mut kinds: Vec<TokenKind>) -> Self {
        kinds.retain(|kind| !matches!(kind, Whitespace));

        match kinds.len() {
            0 => PreviousLines,
            _ => Inline(kinds),
        }
    }
}

/// Tracks the leading-region scan state while partitioning an anchor prefix.
///
/// 在划分锚点前缀时跟踪先导区域扫描状态。
enum LeadingRegionScanState {
    /// Includes tokens in the leading region.
    ///
    /// 将词法单元纳入先导区域。
    Leading,
    /// Excludes code and trailing comments until a newline.
    ///
    /// 排除代码及尾随注释，直到遇到换行。
    Pending,
}
