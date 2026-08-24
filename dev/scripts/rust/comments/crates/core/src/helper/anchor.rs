// dev/scripts/rust/comments/crates/core/src/helper/anchor.rs
use proc_macro2::Span;
use ra_ap_rustc_lexer::{
    tokenize,
    FrontmatterAllowed::No,
    TokenKind::{BlockComment, LineComment, Whitespace},
};
use syn::{spanned::Spanned, AttrStyle::Outer, Attribute};

use super::super::CommentCheckError;

/// Resolves the source byte position anchoring a documentation target.
///
/// 解析文档目标的源码字节锚点。
pub(super) fn target_anchor<T: Spanned>(
    source: &str,
    target: &T,
    attrs: &[Attribute],
) -> Result<usize, CommentCheckError> {
    let target_span = target.span();

    if let Some(anchor) = checked_structural_anchor(source, target_span, attrs)? {
        return Ok(anchor);
    }

    target_declaration_start(source, target_span, attrs)
}

/// Resolves a validated anchor from outer non-documentation target attributes.
///
/// 从目标的外部非文档属性中解析经过验证的锚点。
fn checked_structural_anchor(
    source: &str,
    target: Span,
    attrs: &[Attribute],
) -> Result<Option<usize>, CommentCheckError> {
    let mut structural_attrs = attrs
        .iter()
        .filter(|attribute| is_outer_structural_attribute(attribute))
        .peekable();
    let anchor = structural_attrs
        .peek()
        .map(|attribute| attribute.span().byte_range().start);

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

    Ok(anchor)
}

/// Returns whether an attribute is outer and structural.
///
/// 返回属性是否为外部结构属性。
fn is_outer_structural_attribute(attribute: &Attribute) -> bool {
    matches!(&attribute.style, Outer) && !attribute.path().is_ident("doc")
}

/// Resolves the first declaration token after a target's outer attributes.
///
/// 解析目标外部属性之后的首个声明词法单元。
fn target_declaration_start(
    source: &str,
    target: Span,
    attrs: &[Attribute],
) -> Result<usize, CommentCheckError> {
    let search_start = attrs
        .iter()
        .rfind(|attribute| matches!(&attribute.style, Outer))
        .map(|attribute| attribute.span().byte_range().end)
        .unwrap_or_else(|| target.byte_range().start);
    let region = source
        .get(search_start..target.byte_range().end)
        .ok_or_else(CommentCheckError::location)?;
    let mut cursor = search_start;

    for token in tokenize(region, No) {
        let token_start = cursor;

        cursor += token.len as usize;

        if !matches!(
            token.kind,
            Whitespace | LineComment { .. } | BlockComment { .. }
        ) {
            return Ok(token_start);
        }
    }

    Err(CommentCheckError::location())
}

/// Detects a comment before the first code token.
///
/// 检测首个代码词法单元之前的注释。
fn contains_leading_comment(region: &str) -> bool {
    tokenize(region, No)
        .find(|token| !matches!(token.kind, Whitespace))
        .is_some_and(|token| matches!(token.kind, LineComment { .. } | BlockComment { .. }))
}
