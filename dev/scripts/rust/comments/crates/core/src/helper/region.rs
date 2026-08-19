// dev/scripts/rust/comments/crates/core/src/helper/region.rs
use ra_ap_rustc_lexer::{DocStyle::Inner, TokenKind::BlockComment};
use syn::Attribute;

use super::super::{
    CommentCheckError,
    CommentGroup::{InnerOnly, Mixed, NonDocOnly, OuterOnly},
    CommentRegion::{self, Contiguous, Empty, Separated},
    LeadingRegion,
    LeadingRegionLayout::{Inline, PreviousLines},
};

/// Checks the leading source region of a target without documentation attributes.
///
/// 检查不含文档属性的目标之前的先导源代码区域。
pub(super) fn check_absent_leading_region(
    source: &str,
    anchor: usize,
) -> Result<(), CommentCheckError> {
    let (prefix, region) = analyze_leading_region(source, anchor)?;

    match region.layout() {
        Inline(kinds) => match kinds.last() {
            Some(BlockComment {
                doc_style: None, ..
            }) => Err(CommentCheckError::non_doc()),
            Some(BlockComment {
                doc_style: Some(Inner),
                ..
            }) => Err(CommentCheckError::missing()),
            Some(_) => Err(CommentCheckError::missing()),
            None => unreachable!("inline layouts contain non-whitespace token kinds"),
        },
        PreviousLines => check_absent_previous_lines(&prefix[region.start()..]),
    }
}

/// Checks the leading source region of a target with outer documentation attributes.
///
/// 检查含有外部文档属性的目标之前的先导源代码区域。
pub(super) fn check_outer_leading_region(
    source: &str,
    anchor: usize,
    _attrs: &[Attribute],
) -> Result<(), CommentCheckError> {
    let (prefix, region) = analyze_leading_region(source, anchor)?;

    match region.layout() {
        Inline(_kinds) => {
            let _comment_region = &prefix[region.start()..];

            // TODO: Classify the complete inline outer-only comment region.
            Ok(())
        }
        PreviousLines => {
            // TODO: Classify the outer-only comment region on preceding lines.
            Ok(())
        }
    }
}

/// Analyzes the source prefix and candidate comment region leading an anchor.
///
/// 分析锚点之前的源码前缀与候选注释区域。
fn analyze_leading_region(
    source: &str,
    anchor: usize,
) -> Result<(&str, LeadingRegion), CommentCheckError> {
    let prefix = source
        .get(..anchor)
        .ok_or_else(CommentCheckError::location)?;

    Ok((prefix, LeadingRegion::from_anchor_prefix(prefix)))
}

/// Checks the preceding-line comment region of a target without documentation attributes.
///
/// 检查不含文档属性的目标之前仅位于前序行的注释区域。
fn check_absent_previous_lines(comment_region: &str) -> Result<(), CommentCheckError> {
    match CommentRegion::from_source(comment_region) {
        Empty | Contiguous(InnerOnly) => Err(CommentCheckError::missing()),
        Separated(InnerOnly | Mixed | NonDocOnly) => Err(CommentCheckError::misplaced()),
        Contiguous(Mixed) => Err(CommentCheckError::mixed()),
        Contiguous(NonDocOnly) => Err(CommentCheckError::non_doc()),
        Contiguous(OuterOnly) | Separated(OuterOnly) => {
            unreachable!("preceding-line regions do not classify outer comments")
        }
    }
}
