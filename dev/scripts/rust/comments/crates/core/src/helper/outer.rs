// dev/scripts/rust/comments/crates/core/src/helper/outer.rs
use ra_ap_rustc_lexer::{
    tokenize,
    DocStyle::Outer,
    FrontmatterAllowed,
    TokenKind::{BlockComment, LineComment},
};
use regex::Regex;
use std::sync::LazyLock;

use super::super::{CommentCheckConfig, CommentCheckError};

static HAN_PATTERN: LazyLock<Result<Regex, regex::Error>> =
    LazyLock::new(|| Regex::new(r"\p{Script=Han}"));

/// Checks a contiguous outer-only comment region against the documentation format.
///
/// 根据文档格式检查连续且仅含外部注释的区域。
pub(super) fn check_contiguous_outer_doc_region(
    outer_doc_source: &str,
    config: &CommentCheckConfig,
) -> Result<(), CommentCheckError> {
    let line_contents = tokenize(outer_doc_source, FrontmatterAllowed::No)
        .try_fold((0, Vec::new()), |(cursor, mut line_contents), token| {
            let token_end = cursor + token.len as usize;
            let token_source = &outer_doc_source[cursor..token_end];

            match token.kind {
                LineComment {
                    doc_style: Some(Outer),
                } => line_contents.push(
                    token_source
                        .strip_prefix("///")
                        .ok_or_else(CommentCheckError::invalid_doc_style)?,
                ),
                BlockComment {
                    doc_style: Some(Outer),
                    ..
                } => return Err(CommentCheckError::invalid_doc_style()),
                _ => {}
            }

            Ok((token_end, line_contents))
        })
        .map(|(_, line_contents)| line_contents)?;

    validate_outer_line_doc_contents(&line_contents, config.allowed_ascii_terms())
}

/// Validates normalized outer line documentation contents against the project style.
///
/// 根据项目样式校验规范化的外部行文档注释内容。
fn validate_outer_line_doc_contents(
    lines: &[&str],
    allowed_ascii_terms: &[String],
) -> Result<(), CommentCheckError> {
    let &[english, "", chinese] = lines else {
        return Err(CommentCheckError::invalid_doc_style());
    };
    let han_pattern = HAN_PATTERN
        .as_ref()
        .map_err(|_| CommentCheckError::pattern())?;

    validate_english_line(english, han_pattern)?;
    validate_chinese_line(chinese, allowed_ascii_terms, han_pattern)?;

    Ok(())
}

/// Validates the English documentation line.
///
/// 校验英文文档行。
fn validate_english_line(line: &str, han_pattern: &Regex) -> Result<(), CommentCheckError> {
    match strip_single_content_space(line) {
        Some(content) if contains_ascii_letter(content) && !han_pattern.is_match(content) => Ok(()),
        _ => Err(CommentCheckError::invalid_doc_style()),
    }
}

/// Validates the Chinese documentation line.
///
/// 校验中文文档行。
fn validate_chinese_line(
    line: &str,
    allowed_ascii_terms: &[String],
    han_pattern: &Regex,
) -> Result<(), CommentCheckError> {
    match strip_single_content_space(line) {
        Some(content)
            if han_pattern.is_match(content)
                && contains_allowed_ascii_only(content, allowed_ascii_terms) =>
        {
            Ok(())
        }
        _ => Err(CommentCheckError::invalid_doc_style()),
    }
}

/// Strips exactly one ordinary space before documentation content.
///
/// 去除文档内容之前唯一的一个普通空格。
fn strip_single_content_space(line: &str) -> Option<&str> {
    let content = line.strip_prefix(' ')?;

    (!content.chars().next().is_some_and(char::is_whitespace)).then_some(content)
}

/// Returns whether content contains only ASCII letters from the allowed terms.
///
/// 返回内容是否只包含来自允许术语的 ASCII 字母。
fn contains_allowed_ascii_only(content: &str, allowed_ascii_terms: &[String]) -> bool {
    let content_without_allowed_terms = allowed_ascii_terms
        .iter()
        .fold(content.to_owned(), |content, term| {
            content.replace(term.as_str(), "")
        });

    !contains_ascii_letter(&content_without_allowed_terms)
}

/// Returns whether content contains an ASCII letter.
///
/// 返回内容是否包含 ASCII 字母。
fn contains_ascii_letter(content: &str) -> bool {
    content.bytes().any(|byte| byte.is_ascii_alphabetic())
}
