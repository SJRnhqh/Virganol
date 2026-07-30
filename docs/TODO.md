# Branch TODO

- Branch: feat/spirit-rust-outer-doc-experiment
- Goal: Complete the Outer Doc Comments engineering experiment

## Current

- [ ] Define leading-region decisions for Missing detection from each target anchor to the previous code boundary or source start

## Planned

- [ ] Implement reusable leading-region exploration for code, whitespace, and comment candidates
- [ ] Handle Inner Doc evidence before Missing source fallback
- [ ] Classify and validate non-missing documentation candidates
- [ ] Connect the Outer Doc Comments rule to repository checks and source audits
- [ ] Expand representative CLI/NAPI benchmarks and select the production adapter
- [ ] Validate the selected adapter across supported platforms

## Completed

- [x] Encapsulate target-level Outer Doc validation behind a single core helper interface
- [x] Extract reusable target-anchor resolution behind the core helper boundary
- [x] Align Missing fixture expectations and CLI/NAPI correctness
- [x] Cover Missing source boundaries with dedicated negative fixtures
- [x] Implement source-aware missing Outer Doc detection
- [x] Implement Outer Doc Comments `syn` structure recognition
- [x] Derive and execute missing-documentation cases from positive fixtures
- [x] Expand positive fixtures across required targets, attributed declarations, and anonymous constants
- [x] Standardize fixture identifiers across the shared loader and rule tests
