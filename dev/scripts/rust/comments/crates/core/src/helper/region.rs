// dev/scripts/rust/comments/crates/core/src/helper/region.rs
use proc_macro2::Span;
use ra_ap_rustc_lexer::{DocStyle::Inner, TokenKind::BlockComment};

use super::super::{
    CommentCheckError,
    CommentGroup::{InnerOnly, Mixed, NonDocOnly},
    CommentRegion::{self, Contiguous, Empty, Separated},
    LeadingRegion::{self, Inline, PreviousLines},
};

/// Checks the source region leading a documentation target.
///
/// 检查文档目标之前的源代码区域。
pub(super) fn check_leading_region(source: &str, anchor: Span) -> Result<(), CommentCheckError> {
    let prefix = source
        .get(..anchor.byte_range().start)
        .ok_or_else(CommentCheckError::location)?;

    match LeadingRegion::from_anchor_prefix(prefix) {
        Inline(BlockComment {
            doc_style: None, ..
        }) => Err(CommentCheckError::non_doc()),
        Inline(BlockComment {
            doc_style: Some(Inner),
            ..
        }) => Err(CommentCheckError::missing()),
        Inline(_) => Err(CommentCheckError::missing()),
        PreviousLines { start } => check_previous_lines(&prefix[start..]),
    }
}

/// Checks the leading source region before an anchor line.
///
/// 检查锚点所在行之前的先导源代码区域。
fn check_previous_lines(comment_region: &str) -> Result<(), CommentCheckError> {
    match CommentRegion::from_source(comment_region) {
        Empty | Contiguous(InnerOnly) => Err(CommentCheckError::missing()),
        Separated(InnerOnly | Mixed | NonDocOnly) => Err(CommentCheckError::misplaced()),
        Contiguous(Mixed) => Err(CommentCheckError::mixed()),
        Contiguous(NonDocOnly) => Err(CommentCheckError::non_doc()),
    }
}
