// dev/scripts/rust/comments/crates/core/src/helper/anchor.rs
use proc_macro2::Span;
use ra_ap_rustc_lexer::{
    tokenize, FrontmatterAllowed,
    TokenKind::{BlockComment, LineComment, Whitespace},
};
use syn::{spanned::Spanned, AttrStyle::Outer, Attribute};

use super::super::CommentCheckError;

/// Resolves the earliest source span for a documentation target.
///
/// 解析文档目标最早的源代码位置。
pub(super) fn target_anchor<T: Spanned>(
    source: &str,
    attrs: &[Attribute],
    target: &T,
) -> Result<Span, CommentCheckError> {
    let target_span = target.span();

    check_attribute_regions(source, attrs, target_span)?;

    Ok(attrs
        .iter()
        .find(|attribute| is_structural_anchor_attribute(attribute))
        .map(|attribute| attribute.span())
        .unwrap_or(target_span))
}

/// Checks source regions after outer non-documentation target attributes.
///
/// 检查目标的外部非文档属性之后的源代码区域。
fn check_attribute_regions(
    source: &str,
    attrs: &[Attribute],
    target: Span,
) -> Result<(), CommentCheckError> {
    let mut structural_attrs = attrs
        .iter()
        .filter(|attribute| is_structural_anchor_attribute(attribute))
        .peekable();

    while let Some(attribute) = structural_attrs.next() {
        let region_end = structural_attrs
            .peek()
            .map(|attribute| attribute.span().byte_range().start)
            .unwrap_or_else(|| target.byte_range().end);
        let region = source
            .get(attribute.span().byte_range().end..region_end)
            .ok_or_else(CommentCheckError::location)?;

        if contains_leading_comment(region) {
            return Err(CommentCheckError::misplaced());
        }
    }

    Ok(())
}

/// Returns whether an attribute can anchor a target's structure.
///
/// 返回属性能否作为目标的结构锚点。
fn is_structural_anchor_attribute(attribute: &Attribute) -> bool {
    matches!(&attribute.style, Outer) && !attribute.path().is_ident("doc")
}

/// Detects a comment before the first code token.
///
/// 检测首个代码词法单元之前的注释。
fn contains_leading_comment(region: &str) -> bool {
    tokenize(region, FrontmatterAllowed::No)
        .find(|token| !matches!(token.kind, Whitespace))
        .is_some_and(|token| matches!(token.kind, LineComment { .. } | BlockComment { .. }))
}
