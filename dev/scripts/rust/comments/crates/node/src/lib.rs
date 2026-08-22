// dev/scripts/rust/comments/crates/node/src/lib.rs
use napi::Error;
use napi_derive::napi;
use virganol_rust_comment_checker_core::{check_source, CommentCheckConfig, CommentCheckError};

/// Checks Rust source through the shared comment checker core.
///
/// 通过共享注释检查 core 校验 Rust 源代码。
#[napi]
pub fn check(
    source: String,
    allowed_ascii_terms: Vec<String>,
) -> napi::Result<(), CommentCheckError> {
    let config = CommentCheckConfig::new(allowed_ascii_terms);

    check_source(&source, &config).map_err(Error::from_status)
}
