// dev/scripts/rust/comments/crates/cli/src/main.rs
mod error;
mod runner;

use std::process::ExitCode;

use error::CliError;
use runner::run;

/// Runs the Rust comment checker CLI.
///
/// 运行 Rust 注释检查 CLI。
fn main() -> ExitCode {
    match run() {
        Ok(()) => ExitCode::SUCCESS,
        Err(error) => {
            eprintln!("{}", error.as_ref());
            ExitCode::FAILURE
        }
    }
}
