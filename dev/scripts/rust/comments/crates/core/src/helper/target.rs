// dev/scripts/rust/comments/crates/core/src/helper/target.rs
use syn::spanned::Spanned;
use syn::{AttrStyle, Attribute};

use super::{check_leading_region, target_anchor};

/// Checks one target against the Outer Doc Comments rule.
///
/// 根据外部文档注释规则检查单个目标。
pub(crate) fn check_target_outer_doc<T: Spanned>(
    source: &str,
    attrs: &[Attribute],
    target: &T,
) -> Result<(), String> {
    if attrs.iter().any(|attribute| {
        matches!(attribute.style, AttrStyle::Outer) && attribute.path().is_ident("doc")
    }) {
        return Ok(());
    }

    let anchor = target_anchor(attrs, target);

    check_leading_region(source, anchor)
}
