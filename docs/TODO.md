# Branch TODO

- Branch: `feat/spirit-rust-comment-core`
- Goal: Commit the completed Rust Comments core crate normalization as an isolated change set.

## Current

- [x] Restore and review the stashed Rust Comments core crate normalization.

## Planned

- [x] Verify formatting, compilation, and repository comment-gate coverage.
- [x] Prepare the validated core crate normalization for an isolated commit.

## Completed

- [x] Normalized core crate comments, imports, parameter ordering, implementation layout, and minimum visibility boundaries.
- [x] Extended repository comment-gate coverage to the core crate.
- [x] Consolidated target-specific leading-region validation into `helper/target.rs` and removed the redundant helper module.
- [x] Simplified the leading-region model to `(comment_region_start, LeadingRegion)` and removed the redundant layout suffix.
- [x] Separated comment classification and grouping models from leading-region layout analysis.
