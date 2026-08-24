// dev/scripts/rust/comments/crates/core/src/models/comment.rs
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
};

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
