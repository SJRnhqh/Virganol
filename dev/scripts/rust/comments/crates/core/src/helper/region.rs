// dev/scripts/rust/comments/crates/core/src/helper/region.rs
use proc_macro2::Span;
use ra_ap_rustc_lexer::{
    tokenize,
    DocStyle::Inner,
    FrontmatterAllowed,
    TokenKind::{BlockComment, LineComment, Whitespace},
};

use super::super::{
    LeadingRegion::{self, Inline, PreviousLines},
    LeadingRegionState::{Leading, Pending},
};

/// Checks the source region leading a documentation target.
///
/// 检查文档目标之前的源代码区域。
pub(super) fn check_leading_region(source: &str, anchor: Span) -> Result<(), String> {
    let prefix = source
        .get(..anchor.byte_range().start)
        .ok_or_else(|| "invalid source span".to_owned())?;

    match analyze_leading_region(prefix) {
        Inline(BlockComment {
            doc_style: None, ..
        }) => Err("an ordinary block comment is not a valid outer line doc comment".to_owned()),
        Inline(BlockComment {
            doc_style: Some(Inner),
            ..
        }) => Err("missing outer line doc comment".to_owned()),
        Inline(_) => Err("missing outer line doc comment".to_owned()),
        PreviousLines { start } => check_previous_lines(&prefix[start..]),
    }
}

/// Analyzes the tokens in a complete leading source region.
///
/// 分析完整先导源代码区域中的词法单元。
fn analyze_leading_region(source: &str) -> LeadingRegion {
    let (_, _, comment_region_start, kind) = tokenize(source, FrontmatterAllowed::No).fold(
        (0, Leading, 0, None),
        |(cursor, mut state, mut comment_region_start, kind), token| {
            let token_end = cursor + token.len as usize;
            let (newline_offset, kind) = match token.kind {
                Whitespace => {
                    let offset = source[cursor..token_end].find('\n');

                    (offset, kind.filter(|_| offset.is_none()))
                }
                token_kind => (None, Some(token_kind)),
            };

            match (&mut state, token.kind) {
                (state @ Pending, Whitespace) => {
                    if let Some(newline_offset) = newline_offset {
                        comment_region_start = cursor + newline_offset + 1;
                        *state = Leading;
                    }
                }
                (Pending, LineComment { .. } | BlockComment { .. }) => {
                    comment_region_start = token_end;
                }
                (Leading, Whitespace | LineComment { .. } | BlockComment { .. }) => {}
                _ => {
                    comment_region_start = token_end;
                    state = Pending;
                }
            }

            (token_end, state, comment_region_start, kind)
        },
    );

    match kind {
        Some(kind) => Inline(kind),
        None => PreviousLines {
            start: comment_region_start,
        },
    }
}

/// Checks the leading source region before an anchor line.
///
/// 检查锚点所在行之前的先导源代码区域。
fn check_previous_lines(comment_region: &str) -> Result<(), String> {
    if comment_region.trim().is_empty() {
        return Err("missing outer line doc comment".to_owned());
    }

    Err("invalid outer line doc comment candidate".to_owned())
}
