# Branch TODO

- Branch: feat/spirit-rust-outer-doc-experiment
- Goal: Complete the Outer Line Doc Comments engineering experiment

## Current

- [ ] Exhaust leading-region comment candidates before terminal Missing

## Planned

- [ ] Classify candidate placement, marker, and form across same-line and preceding regions
- [ ] Classify target-owned OuterOnly and Mixed Doc attributes before short-circuiting
- [ ] Keep `syn` parse failures distinct from comment evidence and Missing
- [ ] Connect the Outer Line Doc Comments rule to repository checks and source audits
- [ ] Expand representative CLI/NAPI benchmarks and select the production adapter
- [ ] Validate the selected adapter across supported platforms

## Completed

- [x] Validate Absent target anchors across internal and trailing attribute comment gaps
- [x] Model target-owned Doc attribute combinations and reject InnerOnly targets
- [x] Gate leading-region analysis on the absence of target-owned Outer and Inner Doc attributes
- [x] Propagate the selected CLI/NAPI adapter through the prepared test environment
- [x] Separate rule conformance tests and repository audit behind the Comments Check entry
- [x] Record deferred 0.0.1 test coverage and quality-gate evaluation in the roadmap
- [x] Extract preceding-line comment regions from source start or the last code boundary
- [x] Preserve blank-line evidence while excluding comments trailing code
- [x] Introduce lexer-backed same-line candidate classification with an ordinary block-comment fixture
- [x] Separate same-line gating from reverse blank-line exploration with fail-closed Missing fallback
- [x] Encapsulate anchor source partitioning into preceding lines and the current line prefix
- [x] Standardize the strict rule name as Outer Line Doc Comments across docs, paths, fixtures, JavaScript, and Rust
- [x] Localize leading-region validation and Missing reporting behind the region helper
- [x] Encapsulate target-level Outer Line Doc validation behind a single core helper interface
- [x] Extract reusable target-anchor resolution behind the core helper boundary
- [x] Align Missing fixture expectations and CLI/NAPI correctness
- [x] Complete Missing coverage with generated target cases and dedicated inline, source-start, adjacency, and trailing-comment boundaries
- [x] Implement source-aware missing Outer Line Doc detection
- [x] Implement broad Outer Doc attribute recognition with `syn`
- [x] Derive and execute missing-documentation cases from positive fixtures
- [x] Expand positive fixtures across required targets, attributed declarations, and anonymous constants
- [x] Standardize fixture identifiers across the shared loader and rule tests
