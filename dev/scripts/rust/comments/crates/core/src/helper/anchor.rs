// dev/scripts/rust/comments/crates/core/src/helper/anchor.rs
use proc_macro2::Span;
use syn::spanned::Spanned;
use syn::Attribute;

/// Resolves the earliest source span for a documentation target.
///
/// 解析文档目标最早的源代码位置。
pub(super) fn target_anchor<T>(attrs: &[Attribute], target: &T) -> Span
where
    T: Spanned + ?Sized,
{
    attrs
        .first()
        .map(|attribute| attribute.span())
        .unwrap_or_else(|| target.span())
}
