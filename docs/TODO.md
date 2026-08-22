# Branch TODO

- Branch: feat/spirit-rust-outer-doc-experiment
- Goal: Complete the Outer Line Doc Comments engineering experiment

## Current

- [ ] Review contiguous OuterOnly PreviousLines format validation and separated-region ownership semantics

## Planned

- [ ] Assess whether Absent and OuterOnly PreviousLines analysis can share normalized evidence
- [ ] Handle explicit `#[doc]` attributes after outer-line PreviousLines semantics stabilize
- [ ] Cover remaining blank-line-delimited CommentRegion classifications with fixtures
- [ ] Connect the Outer Line Doc Comments rule to repository checks and source audits
- [ ] Expand representative CLI/NAPI benchmarks and select the production adapter
- [ ] Validate the selected adapter across supported platforms

## Completed

- [x] Share CommentGroup token classification and merge semantics across Inline and PreviousLines
- [x] Recognize outer documentation tokens in blank-line-delimited CommentRegion classifications
- [x] Inline the single-use Absent PreviousLines state mapping into its leading-region branch
- [x] Map shared Inline CommentGroup classification to Absent error semantics
- [x] Map shared Inline CommentGroup classification to OuterOnly error semantics
- [x] Expose ordered non-whitespace token kinds through LeadingRegionLayout::Inline
- [x] Classify comments after the last Inline code token as OuterOnly, InnerOnly, NonDocOnly, or Mixed
- [x] Retain ordered anchor-line token evidence while preserving nearest non-whitespace layout behavior
- [x] Separate Absent and OuterOnly leading checks behind shared neutral prefix analysis
- [x] Preserve reusable comment-region starts across inline and preceding leading layouts
- [x] Cover inline Missing behavior through clean outer structural attribute anchors
- [x] Resolve reusable byte anchors for Absent and OuterOnly while isolating Mixed handling
- [x] Establish structural anchors from outer non-Doc attributes and bound misplaced scans to targets
- [x] Unify typed core, CLI, and NAPI failures behind stable leaf error codes
- [x] Replace core hard-coded failures with the CommentCheckError contract
- [x] Define private Analysis, Rule, and Invalid error classifications for current core failures
- [x] Establish the opaque CommentCheckError model and crate-root re-export
- [x] Standardize the Outer Line Doc Comments rule and directory-backed fixture taxonomy
- [x] Implement source-aware target discovery and broad Outer Doc attribute recognition
- [x] Model anchors, leading regions, and blank-line-delimited comment groups with lexer evidence
- [x] Cover Missing, NonDoc, Mixed, Misplaced, attribute-gap, and source-boundary behavior
- [x] Prepare shared CLI/NAPI test adapters, repository audit separation, and deferred quality gates
