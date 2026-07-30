# Branch TODO

- Branch: feat/spirit-rust-outer-doc-experiment
- Goal: Complete the Outer Line Doc Comments engineering experiment

## Current

- [ ] Extend lexer-backed scanning across preceding source lines with explicit code-boundary and source-start termination

## Planned

- [ ] Unify same-line and preceding-region comment candidate validation
- [ ] Handle Inner Doc evidence before Missing source fallback
- [ ] Classify and validate non-missing documentation candidates
- [ ] Connect the Outer Line Doc Comments rule to repository checks and source audits
- [ ] Expand representative CLI/NAPI benchmarks and select the production adapter
- [ ] Validate the selected adapter across supported platforms

## Completed

- [x] Introduce lexer-backed same-line candidate classification with an ordinary block-comment fixture
- [x] Separate same-line gating from reverse blank-line exploration with fail-closed Missing fallback
- [x] Encapsulate anchor source partitioning into preceding lines and the current line prefix
- [x] Standardize the strict rule name as Outer Line Doc Comments across docs, paths, fixtures, JavaScript, and Rust
- [x] Localize leading-region validation and Missing reporting behind the region helper
- [x] Encapsulate target-level Outer Line Doc validation behind a single core helper interface
- [x] Extract reusable target-anchor resolution behind the core helper boundary
- [x] Align Missing fixture expectations and CLI/NAPI correctness
- [x] Cover Missing source boundaries with dedicated negative fixtures
- [x] Implement source-aware missing Outer Line Doc detection
- [x] Implement broad Outer Doc attribute recognition with `syn`
- [x] Derive and execute missing-documentation cases from positive fixtures
- [x] Expand positive fixtures across required targets, attributed declarations, and anonymous constants
- [x] Standardize fixture identifiers across the shared loader and rule tests
