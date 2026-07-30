// dev/scripts/rust/comments/crates/core/src/lib.rs
mod checker;
mod helper;

pub use checker::check_source;
pub(self) use helper::check_target_outer_doc;
