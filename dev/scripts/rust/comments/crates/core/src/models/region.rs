// dev/scripts/rust/comments/crates/core/src/models/region.rs
use ra_ap_rustc_lexer::{
    tokenize,
    DocStyle::Inner,
    FrontmatterAllowed,
    TokenKind::{self, BlockComment, LineComment, Whitespace},
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
        use LeadingRegionScanState::{Leading, Pending};

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

/// Classifies the comments in a source region before a target.
///
/// 对目标之前源代码区域中的注释进行分类。
pub(crate) enum CommentRegion {
    /// Contains no comment candidate.
    ///
    /// 不包含注释候选。
    Empty,
    /// Contains only parent-owned inner documentation comments.
    ///
    /// 仅包含归属于父级的内部文档注释。
    InnerOnly,
    /// Contains only non-doc comments.
    ///
    /// 包含普通注释，不包含内部文档注释。
    NonDocOnly {
        /// Whether the nearest comment is adjacent to the target.
        ///
        /// 最近注释是否与目标紧邻。
        adjacent: bool,
    },
    /// Contains both non-doc and inner documentation comments.
    ///
    /// 同时包含普通注释和内部文档注释。
    Mixed {
        /// Whether the nearest comment is adjacent to the target.
        ///
        /// 最近注释是否与目标紧邻。
        adjacent: bool,
    },
}

impl CommentRegion {
    /// Classifies a complete comment region before a target.
    ///
    /// 对目标之前的完整注释区域进行分类。
    pub(crate) fn from_source(source: &str) -> Self {
        tokenize(source, FrontmatterAllowed::No)
            .fold((0, Self::Empty), |(cursor, region), token| {
                let token_end = cursor + token.len as usize;
                let region = match token.kind {
                    LineComment { doc_style: None }
                    | BlockComment {
                        doc_style: None, ..
                    } => region.with_non_doc(),
                    LineComment {
                        doc_style: Some(Inner),
                    }
                    | BlockComment {
                        doc_style: Some(Inner),
                        ..
                    } => region.with_inner(),
                    Whitespace => region.with_whitespace(&source[cursor..token_end]),
                    _ => region,
                };

                (token_end, region)
            })
            .1
    }

    /// Adds a non-doc comment to the region.
    ///
    /// 将普通注释加入区域。
    fn with_non_doc(self) -> Self {
        match self {
            Self::Empty | Self::NonDocOnly { .. } => Self::NonDocOnly { adjacent: true },
            Self::InnerOnly | Self::Mixed { .. } => Self::Mixed { adjacent: true },
        }
    }

    /// Adds an inner documentation comment to the region.
    ///
    /// 将内部文档注释加入区域。
    fn with_inner(self) -> Self {
        match self {
            Self::Empty | Self::InnerOnly => Self::InnerOnly,
            Self::NonDocOnly { .. } | Self::Mixed { .. } => Self::Mixed { adjacent: true },
        }
    }

    /// Updates target adjacency from trailing whitespace.
    ///
    /// 根据尾随空白更新与目标的紧邻关系。
    fn with_whitespace(self, whitespace: &str) -> Self {
        let adjacent = whitespace.matches('\n').count() <= 1;

        match self {
            Self::NonDocOnly { .. } => Self::NonDocOnly { adjacent },
            Self::Mixed { .. } => Self::Mixed { adjacent },
            region => region,
        }
    }
}
