// dev/scripts/rust/comments/crates/cli/src/runner.rs
use std::{
    env::args,
    io::{stdin, Read},
};
use virganol_rust_comment_checker_core::{check_source, CommentCheckConfig};

use super::CliError;

/// Reads Rust source from standard input and checks it.
///
/// 从标准输入读取 Rust 源代码并执行检查。
pub(super) fn run() -> Result<(), CliError> {
    let config = CommentCheckConfig::new(parse_allowed_ascii_terms()?);
    let mut source = String::new();

    stdin().read_to_string(&mut source)?;

    check_source(&source, &config)?;

    Ok(())
}

/// Parses repeated allowed ASCII term arguments.
///
/// 解析重复提供的允许 ASCII 术语参数。
fn parse_allowed_ascii_terms() -> Result<Vec<String>, CliError> {
    let mut args = args().skip(1);
    let mut allowed_ascii_terms = Vec::new();

    while let Some(argument) = args.next() {
        if argument != "--allowed-ascii-term" {
            return Err(CliError::Arguments);
        }

        let term = args
            .next()
            .filter(|term| !term.is_empty())
            .ok_or(CliError::Arguments)?;

        allowed_ascii_terms.push(term);
    }

    Ok(allowed_ascii_terms)
}
