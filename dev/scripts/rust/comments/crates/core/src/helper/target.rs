// dev/scripts/rust/comments/crates/core/src/helper/target.rs
use syn::spanned::Spanned;
use syn::{AttrStyle, Attribute};

use super::{has_line_comment_candidate_before, target_anchor};

/// Checks one target against the Outer Doc Comments rule.
///
/// 根据外部文档注释规则检查单个目标。
pub(crate) fn check_target_outer_doc<T>(
    source: &str,
    attrs: &[Attribute],
    target: &T,
) -> Result<(), String>
where
    T: Spanned + ?Sized,
{
    if attrs.iter().any(|attribute| {
        matches!(attribute.style, AttrStyle::Outer) && attribute.path().is_ident("doc")
    }) {
        return Ok(());
    }

    let anchor = target_anchor(attrs, target);

    if has_line_comment_candidate_before(source, anchor)? {
        // TODO: Classify and validate non-empty source comment candidates.
        return Ok(());
    }

    Err("missing outer doc comment".to_owned())
}
