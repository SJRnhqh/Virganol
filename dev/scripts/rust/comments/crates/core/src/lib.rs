// dev/scripts/rust/comments/crates/core/src/lib.rs
mod checker;
mod helper;
mod models;

pub use checker::check_source;
pub(self) use helper::check_target_outer_line_doc;
pub use models::CommentCheckError;
pub(self) use models::{CommentGroup, CommentRegion, DocAttrs, LeadingRegion, LeadingRegionLayout};
