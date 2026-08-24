// dev/scripts/rust/comments/crates/core/src/helper/target.rs
use syn::{spanned::Spanned, Attribute};

use super::super::{
    CommentCheckConfig, CommentCheckError,
    CommentGroup::{
        self, InnerOnly as InnerCommentOnly, Mixed as MixedCommentKinds, NonDocOnly, OuterOnly,
    },
    CommentRegion::{self, Contiguous, Empty, Separated},
    DocAttrs::{self, Absent, InnerOnly, Mixed, OuterOnly as OuterDocAttrs},
    LeadingRegion,
    LeadingRegionLayout::{Inline, PreviousLines},
};
use super::{check_contiguous_outer_doc_region, target_anchor};

/// Checks one target against the Outer Line Doc Comments rule.
///
/// 根据外部行文档注释规则检查单个目标。
pub(crate) fn check_target_outer_line_doc<T: Spanned>(
    source: &str,
    config: &CommentCheckConfig,
    target: &T,
    attrs: &[Attribute],
) -> Result<(), CommentCheckError> {
    match DocAttrs::from_attributes(attrs) {
        doc_attrs @ (Absent | OuterDocAttrs) => {
            let anchor = target_anchor(source, target, attrs)?;

            check_leading_region(source, config, doc_attrs, anchor)
        }
        InnerOnly => Err(CommentCheckError::invalid_doc_style()),
        Mixed => Err(CommentCheckError::mixed()),
    }
}

/// Checks a target leading source region against its documentation attributes.
///
/// 根据目标文档属性检查其之前的先导源代码区域。
fn check_leading_region(
    source: &str,
    config: &CommentCheckConfig,
    doc_attrs: DocAttrs,
    anchor: usize,
) -> Result<(), CommentCheckError> {
    let (prefix, region) = analyze_leading_region(source, anchor)?;

    match doc_attrs {
        Absent => match region.layout() {
            Inline(kinds) => match CommentGroup::classify_inline(kinds) {
                None | Some(InnerCommentOnly) => Err(CommentCheckError::missing()),
                Some(NonDocOnly) => Err(CommentCheckError::non_doc()),
                Some(MixedCommentKinds) => Err(CommentCheckError::mixed()),
                Some(OuterOnly) => Err(CommentCheckError::mismatch()),
            },
            PreviousLines => match CommentRegion::analyze_source(&prefix[region.start()..]).0 {
                Empty | Contiguous(InnerCommentOnly) => Err(CommentCheckError::missing()),
                Separated(InnerCommentOnly | MixedCommentKinds | NonDocOnly) => {
                    Err(CommentCheckError::misplaced())
                }
                Contiguous(MixedCommentKinds) => Err(CommentCheckError::mixed()),
                Contiguous(NonDocOnly) => Err(CommentCheckError::non_doc()),
                Contiguous(OuterOnly) | Separated(OuterOnly) => Err(CommentCheckError::mismatch()),
            },
        },
        OuterDocAttrs => match region.layout() {
            Inline(kinds) => match CommentGroup::classify_inline(kinds) {
                Some(OuterOnly) => Err(CommentCheckError::invalid_doc_style()),
                Some(InnerCommentOnly | NonDocOnly | MixedCommentKinds) => {
                    Err(CommentCheckError::mixed())
                }
                None => Err(CommentCheckError::mismatch()),
            },
            PreviousLines => match CommentRegion::analyze_source(&prefix[region.start()..]) {
                (Empty, _) => Err(CommentCheckError::mismatch()),
                (Separated(_), _) => Err(CommentCheckError::misplaced()),
                (Contiguous(InnerCommentOnly | NonDocOnly | MixedCommentKinds), _) => {
                    Err(CommentCheckError::mixed())
                }
                (Contiguous(OuterOnly), Some(outer_doc_source)) => {
                    check_contiguous_outer_doc_region(outer_doc_source, config)
                }
                (Contiguous(OuterOnly), None) => Err(CommentCheckError::mismatch()),
            },
        },
        _ => Err(CommentCheckError::mismatch()),
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
