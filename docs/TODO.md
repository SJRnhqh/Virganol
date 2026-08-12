# Branch TODO

- Branch: feat/spirit-rust-outer-doc-experiment
- Goal: Complete the Outer Line Doc Comments engineering experiment

## Current

- [ ] Design OuterOnly leading-region handling from the shared target anchor

## Planned

- [ ] Cover remaining blank-line-delimited CommentRegion classifications with fixtures
- [ ] Classify candidate placement, marker, and form across same-line and preceding regions
- [ ] Connect the Outer Line Doc Comments rule to repository checks and source audits
- [ ] Expand representative CLI/NAPI benchmarks and select the production adapter
- [ ] Validate the selected adapter across supported platforms

## Completed

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
