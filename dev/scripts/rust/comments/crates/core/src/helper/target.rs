// dev/scripts/rust/comments/crates/core/src/helper/target.rs
use syn::{spanned::Spanned, Attribute};

use super::super::{
    CommentCheckConfig, CommentCheckError,
    DocAttrs::{self, Absent, InnerOnly, Mixed, OuterOnly},
};
use super::{check_absent_leading_region, check_outer_leading_region, target_anchor};

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
        Absent => {
            let anchor = target_anchor(source, target, attrs)?;

            check_absent_leading_region(source, anchor)
        }
        InnerOnly => Err(CommentCheckError::invalid_doc_style()),
        OuterOnly => {
            let anchor = target_anchor(source, target, attrs)?;

            check_outer_leading_region(source, config, anchor)
        }
        Mixed => Err(CommentCheckError::mixed()),
    }
}
