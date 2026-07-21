// dev/scripts/rust/comments/crates/core/src/checker.rs

/// Parses Rust source code for checking.
///
/// 解析源代码以供检查。
pub fn check_source(source: &str) -> Result<(), String> {
    syn::parse_file(source)
        .map(|_| ())
        .map_err(|error| error.to_string())
}
