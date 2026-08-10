// dev/scripts/rust/comments/crates/core/src/helper/region.rs
use proc_macro2::Span;
use ra_ap_rustc_lexer::{DocStyle::Inner, TokenKind::BlockComment};

use super::super::{
    CommentRegion::{self, Empty, InnerOnly, Mixed, NonDocOnly},
    LeadingRegion::{self, Inline, PreviousLines},
};

/// Checks the source region leading a documentation target.
///
/// 检查文档目标之前的源代码区域。
pub(super) fn check_leading_region(source: &str, anchor: Span) -> Result<(), String> {
    let prefix = source
        .get(..anchor.byte_range().start)
        .ok_or_else(|| "invalid source span".to_owned())?;

    match LeadingRegion::from_anchor_prefix(prefix) {
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

/// Checks the leading source region before an anchor line.
///
/// 检查锚点所在行之前的先导源代码区域。
fn check_previous_lines(comment_region: &str) -> Result<(), String> {
    match CommentRegion::from_source(comment_region) {
        Empty | InnerOnly => Err("missing outer line doc comment".to_owned()),
        NonDocOnly { adjacent: false } | Mixed { adjacent: false } => {
            Err("misplaced outer line doc comment candidate".to_owned())
        }
        Mixed { adjacent: true } => Err("mixed outer line doc comment candidate".to_owned()),
        NonDocOnly { adjacent: true } => Err("non-doc outer line doc comment candidate".to_owned()),
    }
}
