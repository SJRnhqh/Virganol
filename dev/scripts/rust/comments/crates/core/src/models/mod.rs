// dev/scripts/rust/comments/crates/core/src/models/mod.rs
mod attrs;
mod comment;
mod config;
mod error;
mod region;

pub(super) use attrs::DocAttrs;
pub(super) use comment::{CommentGroup, CommentRegion};
pub use config::CommentCheckConfig;
pub use error::CommentCheckError;
pub(super) use region::LeadingRegion;
