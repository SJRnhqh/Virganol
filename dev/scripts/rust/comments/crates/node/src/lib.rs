// dev/scripts/rust/comments/crates/node/src/lib.rs
use napi::Error;
use napi_derive::napi;
use virganol_rust_comment_checker_core::check_source;

/// Checks Rust source through the shared comment checker core.
///
/// 通过共享注释检查 core 校验 Rust 源代码。
#[napi]
pub fn check(source: String) -> napi::Result<()> {
    check_source(&source).map_err(Error::from_reason)
}
