// dev/scripts/rust/comments/crates/cli/src/runner.rs
use std::io::{self, Read};

use virganol_rust_comment_checker_core::check_source;

use super::CliError;

/// Reads Rust source from standard input and checks it.
///
/// 从标准输入读取 Rust 源代码并执行检查。
pub(super) fn run() -> Result<(), CliError> {
    let mut source = String::new();

    io::stdin().read_to_string(&mut source)?;

    check_source(&source)?;

    Ok(())
}
