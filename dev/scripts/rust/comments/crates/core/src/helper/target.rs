// dev/scripts/rust/comments/crates/core/src/helper/target.rs
use syn::spanned::Spanned;
use syn::Attribute;

use super::super::{
    CommentCheckError,
    DocAttrs::{self, Absent, InnerOnly, Mixed, OuterOnly},
};
use super::{check_absent_leading_region, check_outer_leading_region, target_anchor};

/// Checks one target against the Outer Line Doc Comments rule.
///
/// 根据外部行文档注释规则检查单个目标。
pub(crate) fn check_target_outer_line_doc<T: Spanned>(
    source: &str,
    attrs: &[Attribute],
    target: &T,
) -> Result<(), CommentCheckError> {
    match DocAttrs::from_attributes(attrs) {
        Absent => {
            let anchor = target_anchor(source, attrs, target)?;

            check_absent_leading_region(source, anchor)
        }
        InnerOnly => Err(CommentCheckError::invalid_doc_style()),
        OuterOnly => {
            let anchor = target_anchor(source, attrs, target)?;

            check_outer_leading_region(source, anchor, attrs)
        }
        Mixed => Err(CommentCheckError::mixed()),
    }
}
