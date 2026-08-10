// dev/scripts/rust/comments/crates/core/src/models/region.rs
use ra_ap_rustc_lexer::{
    tokenize,
    DocStyle::Inner,
    FrontmatterAllowed,
    TokenKind::{self, BlockComment, LineComment, Whitespace},
};

use self::{
    CommentGroup::{InnerOnly, Mixed, NonDocOnly},
    CommentRegion::{Contiguous, Empty, Separated},
    CommentRegionTokenRole::{Comment, Irrelevant, Separator},
    LeadingRegionScanState::{Leading, Pending},
};

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

impl LeadingRegion {
    /// Classifies an anchor prefix into its relevant leading region.
    ///
    /// 将锚点前缀分类为与目标相关的先导区域。
    pub(crate) fn from_anchor_prefix(prefix: &str) -> Self {
        let (_, _, comment_region_start, kind) = tokenize(prefix, FrontmatterAllowed::No).fold(
            (0, Leading, 0, None),
            |(cursor, mut state, mut comment_region_start, kind), token| {
                let token_end = cursor + token.len as usize;
                let (newline_offset, kind) = match token.kind {
                    Whitespace => {
                        let offset = prefix[cursor..token_end].find('\n');

                        (offset, kind.filter(|_| offset.is_none()))
                    }
                    token_kind => (None, Some(token_kind)),
                };

                match (&mut state, token.kind) {
                    (state @ Pending, Whitespace) => {
                        if let Some(newline_offset) = newline_offset {
                            comment_region_start = cursor + newline_offset + 1;
                            *state = Leading;
                        }
                    }
                    (Pending, LineComment { .. } | BlockComment { .. }) => {
                        comment_region_start = token_end;
                    }
                    (Leading, Whitespace | LineComment { .. } | BlockComment { .. }) => {}
                    _ => {
                        comment_region_start = token_end;
                        state = Pending;
                    }
                }

                (token_end, state, comment_region_start, kind)
            },
        );

        match kind {
            Some(kind) => Self::Inline(kind),
            None => Self::PreviousLines {
                start: comment_region_start,
            },
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

/// Classifies the contents of a contiguous comment group.
///
/// 对连续注释组的内容进行分类。
pub(crate) enum CommentGroup {
    /// Contains only parent-owned inner documentation comments.
    ///
    /// 仅包含归属于父级的内部文档注释。
    InnerOnly,
    /// Contains only non-doc comments.
    ///
    /// 包含非文档注释，不包含内部文档注释。
    NonDocOnly,
    /// Contains both non-doc and inner documentation comments.
    ///
    /// 同时包含非文档注释和内部文档注释。
    Mixed,
}

/// Represents the nearest blank-line-delimited comment group before a target.
///
/// 表示目标之前由空行分隔的最近注释组。
pub(crate) enum CommentRegion {
    /// Contains no comment group.
    ///
    /// 不包含注释组。
    Empty,
    /// Keeps a comment group contiguous with the scan frontier.
    ///
    /// 注释组与扫描边缘保持连续。
    Contiguous(
        /// Contents of the contiguous comment group.
        ///
        /// 连续注释组的内容。
        CommentGroup,
    ),
    /// Separates a comment group from the scan frontier with a blank line.
    ///
    /// 注释组与扫描边缘之间存在空行。
    Separated(
        /// Contents of the separated comment group.
        ///
        /// 已分隔注释组的内容。
        CommentGroup,
    ),
}

impl CommentRegion {
    /// Classifies the nearest blank-line-delimited group in a comment region.
    ///
    /// 对注释区域中由空行分隔的最近注释组进行分类。
    pub(crate) fn from_source(source: &str) -> Self {
        tokenize(source, FrontmatterAllowed::No)
            .fold((0, Empty), |(cursor, region), token| {
                let token_end = cursor + token.len as usize;
                let token_role =
                    CommentRegionTokenRole::from_token(token.kind, &source[cursor..token_end]);
                let region = match (region, token_role) {
                    (Empty | Separated(_), Comment(group)) => Contiguous(group),
                    (Contiguous(InnerOnly), Comment(NonDocOnly))
                    | (Contiguous(NonDocOnly), Comment(InnerOnly))
                    | (Contiguous(Mixed), Comment(_)) => Contiguous(Mixed),
                    (Contiguous(group), Comment(_)) => Contiguous(group),
                    (Contiguous(group), Separator) => Separated(group),
                    (region, Irrelevant | Separator) => region,
                };

                (token_end, region)
            })
            .1
    }
}

/// Classifies a lexer token by its role in comment-region scanning.
///
/// 按词法单元在注释区域扫描中的作用进行分类。
enum CommentRegionTokenRole {
    /// Contributes a comment to the current group.
    ///
    /// 向当前注释组加入一条注释。
    Comment(
        /// Classification contributed by the comment token.
        ///
        /// 该注释词法单元提供的内容分类。
        CommentGroup,
    ),
    /// Separates the current group from the scan frontier.
    ///
    /// 将当前注释组与扫描边缘分隔开。
    Separator,
    /// Does not affect comment-region classification.
    ///
    /// 不影响注释区域分类。
    Irrelevant,
}

impl CommentRegionTokenRole {
    /// Classifies a lexer token and its source text by its comment-region role.
    ///
    /// 根据词法单元及其源码文本判定其在注释区域中的作用。
    fn from_token(kind: TokenKind, token_source: &str) -> Self {
        match kind {
            LineComment { doc_style: None }
            | BlockComment {
                doc_style: None, ..
            } => Comment(NonDocOnly),
            LineComment {
                doc_style: Some(Inner),
            }
            | BlockComment {
                doc_style: Some(Inner),
                ..
            } => Comment(InnerOnly),
            Whitespace if token_source.matches('\n').count() > 1 => Separator,
            _ => Irrelevant,
        }
    }
}
