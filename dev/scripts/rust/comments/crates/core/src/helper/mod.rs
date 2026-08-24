// dev/scripts/rust/comments/crates/core/src/helper/mod.rs
mod anchor;
mod outer;
mod target;

pub(self) use anchor::target_anchor;
pub(self) use outer::check_contiguous_outer_doc_region;
pub(super) use target::check_target_outer_line_doc;
