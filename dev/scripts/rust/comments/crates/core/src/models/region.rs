// dev/scripts/rust/comments/crates/core/src/models/region.rs
use ra_ap_rustc_lexer::{
    tokenize,
    DocStyle::{Inner, Outer},
    FrontmatterAllowed::No,
    TokenKind::{self, BlockComment, LineComment, Whitespace},
};

use self::{
    CommentGroup::{InnerOnly, Mixed, NonDocOnly, OuterOnly},
    CommentRegion::{Contiguous, Empty, Separated},
    CommentRegionTokenRole::{Comment, Irrelevant, Separator},
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

/// Classifies the comment kinds contained in a comment group.
///
/// 对注释组中包含的注释类型进行分类。
pub(crate) enum CommentGroup {
    /// Contains only outer documentation comments.
    ///
    /// 仅包含外部文档注释。
    OuterOnly,
    /// Contains only inner documentation comments.
    ///
    /// 仅包含内部文档注释。
    InnerOnly,
    /// Contains only non-doc comments.
    ///
    /// 仅包含非文档注释。
    NonDocOnly,
    /// Contains two or more different comment kinds.
    ///
    /// 包含两种或更多不同的注释类型。
    Mixed,
}

impl CommentGroup {
    /// Classifies comments after the last code token in ordered inline evidence.
    ///
    /// 对有序同行证据中最后一个代码词法单元之后的注释进行分类。
    pub(crate) fn classify_inline(kinds: &[TokenKind]) -> Option<Self> {
        let kinds = kinds
            .iter()
            .rposition(|kind| {
                !matches!(kind, Whitespace | LineComment { .. } | BlockComment { .. })
            })
            .map_or(kinds, |index| &kinds[index + 1..]);

        kinds
            .iter()
            .filter_map(Self::from_token_kind)
            .fold(None, |group, kind| {
                Some(match group {
                    Some(group) => group.merge(kind),
                    None => kind,
                })
            })
    }

    /// Classifies one lexer token as a comment kind.
    ///
    /// 将单个词法单元分类为注释类型。
    fn from_token_kind(kind: &TokenKind) -> Option<Self> {
        match kind {
            LineComment {
                doc_style: Some(Outer),
            }
            | BlockComment {
                doc_style: Some(Outer),
                ..
            } => Some(OuterOnly),
            LineComment {
                doc_style: Some(Inner),
            }
            | BlockComment {
                doc_style: Some(Inner),
                ..
            } => Some(InnerOnly),
            LineComment { doc_style: None }
            | BlockComment {
                doc_style: None, ..
            } => Some(NonDocOnly),
            _ => None,
        }
    }

    /// Merges one additional comment kind into this group.
    ///
    /// 将另一种注释类型合并到当前注释组。
    fn merge(self, kind: Self) -> Self {
        match (self, kind) {
            (OuterOnly, OuterOnly) => OuterOnly,
            (InnerOnly, InnerOnly) => InnerOnly,
            (NonDocOnly, NonDocOnly) => NonDocOnly,
            _ => Mixed,
        }
    }
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
    /// Analyzes the nearest blank-line-delimited group and its contiguous source.
    ///
    /// 分析由空行分隔的最近注释组及其连续源码。
    pub(crate) fn analyze_source(source: &str) -> (Self, Option<&str>) {
        let (_, region, contiguous_start) =
            tokenize(source, No).fold((0, Empty, None), |(cursor, region, start), token| {
                let token_end = cursor + token.len as usize;
                let token_role =
                    CommentRegionTokenRole::from_token(token.kind, &source[cursor..token_end]);
                let (region, start) = match (region, token_role) {
                    (Empty | Separated(_), Comment(group)) => (Contiguous(group), Some(cursor)),
                    (Contiguous(group), Comment(kind)) => (Contiguous(group.merge(kind)), start),
                    (Contiguous(group), Separator) => (Separated(group), None),
                    (region, Irrelevant | Separator) => (region, start),
                };

                (token_end, region, start)
            });
        (
            region,
            contiguous_start.and_then(|start| source.get(start..)),
        )
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
        if let Some(group) = CommentGroup::from_token_kind(&kind) {
            return Comment(group);
        }

        match kind {
            Whitespace if token_source.matches('\n').count() > 1 => Separator,
            _ => Irrelevant,
        }
    }
}
