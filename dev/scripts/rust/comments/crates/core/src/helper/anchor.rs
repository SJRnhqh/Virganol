// dev/scripts/rust/comments/crates/core/src/helper/anchor.rs
use proc_macro2::Span;
use ra_ap_rustc_lexer::{
    tokenize, FrontmatterAllowed,
    TokenKind::{BlockComment, LineComment, Whitespace},
};
use syn::spanned::Spanned;
use syn::Attribute;

use super::super::CommentCheckError;

/// Resolves the earliest source span for a documentation target.
///
/// 解析文档目标最早的源代码位置。
pub(super) fn target_anchor<T: Spanned>(
    source: &str,
    attrs: &[Attribute],
    target: &T,
) -> Result<Span, CommentCheckError> {
    check_attribute_regions(source, attrs)?;

    Ok(attrs
        .first()
        .map(|attribute| attribute.span())
        .unwrap_or_else(|| target.span()))
}

/// Checks source regions after target attributes.
///
/// 检查目标属性之后的源代码区域。
fn check_attribute_regions(source: &str, attrs: &[Attribute]) -> Result<(), CommentCheckError> {
    let region_ends = attrs
        .iter()
        .skip(1)
        .map(|attribute| attribute.span().byte_range().start)
        .chain([source.len()]);

    for (attribute, region_end) in attrs.iter().zip(region_ends) {
        let region = source
            .get(attribute.span().byte_range().end..region_end)
            .ok_or_else(CommentCheckError::location)?;

        if contains_leading_comment(region) {
            return Err(CommentCheckError::misplaced());
        }
    }

    Ok(())
}

/// Detects a comment before the first code token.
///
/// 检测首个代码词法单元之前的注释。
fn contains_leading_comment(region: &str) -> bool {
    tokenize(region, FrontmatterAllowed::No)
        .find(|token| !matches!(token.kind, Whitespace))
        .is_some_and(|token| matches!(token.kind, LineComment { .. } | BlockComment { .. }))
}
