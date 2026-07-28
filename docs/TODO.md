# Branch TODO

- Branch: feat/spirit-rust-outer-doc-experiment
- Goal: Complete the Outer Doc Comments engineering experiment

## Current

- [ ] Classify and validate non-missing Outer Doc comment candidates

## Planned

- [ ] Expand Missing source fallback to the three-line documentation window
- [ ] Connect the Outer Doc Comments rule to repository checks and source audits
- [ ] Expand representative CLI/NAPI benchmarks and select the production adapter
- [ ] Validate the selected adapter across supported platforms

## Completed

- [x] Align Missing fixture expectations and CLI/NAPI correctness
- [x] Cover Missing source boundaries with dedicated negative fixtures
- [x] Implement source-aware missing Outer Doc detection
- [x] Implement Outer Doc Comments `syn` structure recognition
- [x] Derive and execute missing-documentation cases from positive fixtures
- [x] Expand positive fixtures across required targets, attributed declarations, and anonymous constants
- [x] Standardize fixture identifiers across the shared loader and rule tests
