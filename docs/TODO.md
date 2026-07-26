# Branch TODO

- Branch: feat/spirit-rust-outer-doc-experiment
- Goal: Complete the Outer Doc Comments engineering experiment

## Current

- [ ] Implement Outer Doc Comments `syn` structure recognition

## Planned

- [ ] Expand derived negative cases beyond missing documentation
- [ ] Align fixture expectations and CLI/NAPI correctness
- [ ] Connect the rule to fixture tests, repository checks, and source audits
- [ ] Expand representative CLI/NAPI benchmarks and select the production adapter
- [ ] Validate the selected adapter across supported platforms

## Completed

- [x] Derive missing-documentation TODO cases from positive fixtures
- [x] Expand positive fixtures across required targets and attributed declarations
- [x] Standardize fixture identifiers across the shared loader and rule tests
