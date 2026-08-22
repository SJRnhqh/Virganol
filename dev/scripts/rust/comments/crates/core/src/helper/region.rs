// dev/scripts/rust/comments/crates/core/src/helper/region.rs
use super::super::{
    CommentCheckConfig, CommentCheckError,
    CommentGroup::{self, InnerOnly, Mixed, NonDocOnly, OuterOnly},
    CommentRegion::{self, Contiguous, Empty, Separated},
    LeadingRegion,
    LeadingRegionLayout::{Inline, PreviousLines},
};
use super::check_contiguous_outer_doc_region;

/// Checks the leading source region of a target without documentation attributes.
///
/// 检查不含文档属性的目标之前的先导源代码区域。
pub(super) fn check_absent_leading_region(
    source: &str,
    anchor: usize,
) -> Result<(), CommentCheckError> {
    let (prefix, region) = analyze_leading_region(source, anchor)?;

    match region.layout() {
        Inline(kinds) => match CommentGroup::classify_inline(kinds) {
            None | Some(InnerOnly) => Err(CommentCheckError::missing()),
            Some(NonDocOnly) => Err(CommentCheckError::non_doc()),
            Some(Mixed) => Err(CommentCheckError::mixed()),
            Some(OuterOnly) => Err(CommentCheckError::mismatch()),
        },
        PreviousLines => match CommentRegion::analyze_source(&prefix[region.start()..]).0 {
            Empty | Contiguous(InnerOnly) => Err(CommentCheckError::missing()),
            Separated(InnerOnly | Mixed | NonDocOnly) => Err(CommentCheckError::misplaced()),
            Contiguous(Mixed) => Err(CommentCheckError::mixed()),
            Contiguous(NonDocOnly) => Err(CommentCheckError::non_doc()),
            Contiguous(OuterOnly) | Separated(OuterOnly) => Err(CommentCheckError::mismatch()),
        },
    }
}

/// Checks the leading source region of a target with outer documentation attributes.
///
/// 检查含有外部文档属性的目标之前的先导源代码区域。
pub(super) fn check_outer_leading_region(
    source: &str,
    anchor: usize,
    config: &CommentCheckConfig,
) -> Result<(), CommentCheckError> {
    let (prefix, region) = analyze_leading_region(source, anchor)?;

    match region.layout() {
        Inline(kinds) => match CommentGroup::classify_inline(kinds) {
            Some(OuterOnly) => Err(CommentCheckError::invalid_doc_style()),
            Some(InnerOnly | NonDocOnly | Mixed) => Err(CommentCheckError::mixed()),
            None => Err(CommentCheckError::mismatch()),
        },
        PreviousLines => match CommentRegion::analyze_source(&prefix[region.start()..]) {
            (Empty, _) => Err(CommentCheckError::mismatch()),
            (Separated(_), _) => Err(CommentCheckError::misplaced()),
            (Contiguous(InnerOnly | NonDocOnly | Mixed), _) => Err(CommentCheckError::mixed()),
            (Contiguous(OuterOnly), Some(outer_doc_source)) => {
                check_contiguous_outer_doc_region(outer_doc_source, config)
            }
            (Contiguous(OuterOnly), None) => Err(CommentCheckError::mismatch()),
        },
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
