// dev/scripts/rust/comments/crates/core/src/models/mod.rs
mod attrs;
mod error;
mod region;

pub(super) use attrs::DocAttrs;
pub use error::CommentCheckError;
pub(super) use region::{CommentGroup, CommentRegion, LeadingRegion};
