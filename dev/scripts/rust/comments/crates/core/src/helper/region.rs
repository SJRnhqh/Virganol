// dev/scripts/rust/comments/crates/core/src/helper/region.rs
use proc_macro2::Span;
use ra_ap_rustc_lexer::{tokenize, FrontmatterAllowed, TokenKind};

/// Checks the source region leading a documentation target.
///
/// 检查文档目标之前的源代码区域。
pub(super) fn check_leading_region(source: &str, anchor: Span) -> Result<(), String> {
    let (previous_lines, anchor_line_prefix) = split_source_before_anchor(source, anchor)
        .ok_or_else(|| "invalid source span".to_owned())?;

    check_anchor_line_prefix(anchor_line_prefix)?;

    check_previous_lines(previous_lines)
}

/// Splits source before an anchor into preceding lines and the current line prefix.
///
/// 将锚点前的源代码拆分为之前的行与当前行前缀。
fn split_source_before_anchor(source: &str, anchor: Span) -> Option<(&str, &str)> {
    let prefix = source.get(..anchor.byte_range().start)?;
    let anchor_line_start = prefix.rfind('\n').map_or(0, |index| index + 1);

    Some(prefix.split_at(anchor_line_start))
}

/// Checks the source prefix before an anchor on its line.
///
/// 检查锚点所在行中位于锚点之前的源代码前缀。
fn check_anchor_line_prefix(line_prefix: &str) -> Result<(), String> {
    let nearest_kind = tokenize(line_prefix, FrontmatterAllowed::No)
        .map(|token| token.kind)
        .filter(|kind| *kind != TokenKind::Whitespace)
        .last();

    // TODO: Prefer a placement diagnostic for same-line comment candidates
    // once typed errors are introduced.
    // TODO: Classify inner doc comments when invalid-marker diagnostics
    // are introduced.
    match nearest_kind {
        None => Ok(()),
        Some(TokenKind::BlockComment {
            doc_style: None, ..
        }) => Err("an ordinary block comment is not a valid outer line doc comment".to_owned()),
        Some(_) => Err("missing outer line doc comment".to_owned()),
    }
}

/// Checks complete source lines before an anchor line.
///
/// 检查锚点所在行之前的完整源代码行。
fn check_previous_lines(previous_lines: &str) -> Result<(), String> {
    let comment_region = extract_comment_region(previous_lines);

    if comment_region.trim().is_empty() {
        return Err("missing outer line doc comment".to_owned());
    }

    // TODO: Split candidate placement, marker, and content failures when
    // typed diagnostics are introduced.
    Err("invalid outer line doc comment candidate".to_owned())
}

/// Extracts the comment region, excluding comments trailing code.
///
/// 提取注释区域，并排除尾随在代码之后的注释。
fn extract_comment_region(source: &str) -> &str {
    let (_, region_start, _) = tokenize(source, FrontmatterAllowed::No).fold(
        (0, 0, false),
        |(token_start, mut region_start, mut pending_code_boundary), token| {
            let token_end = token_start + token.len as usize;

            match token.kind {
                TokenKind::Whitespace if pending_code_boundary => {
                    if let Some(newline_offset) = source[token_start..token_end].find('\n') {
                        region_start = token_start + newline_offset + 1;
                        pending_code_boundary = false;
                    }
                }
                TokenKind::LineComment { .. } | TokenKind::BlockComment { .. }
                    if pending_code_boundary =>
                {
                    region_start = token_end;
                }
                TokenKind::Whitespace
                | TokenKind::LineComment { .. }
                | TokenKind::BlockComment { .. } => {}
                _ => {
                    region_start = token_end;
                    pending_code_boundary = true;
                }
            }

            (token_end, region_start, pending_code_boundary)
        },
    );

    &source[region_start..]
}
