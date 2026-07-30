// dev/scripts/rust/comments/crates/core/src/helper/mod.rs
mod anchor;
mod region;
mod target;

pub(self) use anchor::target_anchor;
pub(self) use region::has_line_comment_candidate_before;
pub(super) use target::check_target_outer_doc;
