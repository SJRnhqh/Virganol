// dev/scripts/rust/comments/crates/core/src/helper/region.rs
use proc_macro2::Span;

/// Checks the source region leading a documentation target.
///
/// 检查文档目标之前的源代码区域。
pub(super) fn check_leading_region(source: &str, anchor: Span) -> Result<(), String> {
    let (previous_lines, anchor_line_prefix) = split_source_before_anchor(source, anchor)
        .ok_or_else(|| "invalid source span".to_owned())?;

    if has_content_before_anchor(anchor_line_prefix) {
        return Err("missing outer line doc comment".to_owned());
    }

    let Some(previous_line) = previous_lines.lines().next_back() else {
        return Err("missing outer line doc comment".to_owned());
    };

    if previous_line.trim_start().starts_with("//") {
        // TODO: Classify and validate non-empty source comment candidates.
        return Ok(());
    }

    Err("missing outer line doc comment".to_owned())
}

/// Splits source before an anchor into preceding lines and the current line prefix.
///
/// 将锚点前的源代码拆分为之前的行与当前行前缀。
fn split_source_before_anchor(source: &str, anchor: Span) -> Option<(&str, &str)> {
    let prefix = source.get(..anchor.byte_range().start)?;
    let anchor_line_start = prefix.rfind('\n').map_or(0, |index| index + 1);

    Some(prefix.split_at(anchor_line_start))
}

/// Checks whether non-whitespace content precedes an anchor on the same line.
///
/// 检查锚点所在行前方是否存在非空白内容。
fn has_content_before_anchor(line_prefix: &str) -> bool {
    !line_prefix.trim().is_empty()
}
