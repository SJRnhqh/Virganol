# Branch TODO

- Branch: feat/spirit-reliability-polish
- Goal: Polish Provider reliability architecture — Settings upgrade, policy audit, lint hardening, and architecture documentation

## Current

- [ ] Implement Source File Header repository checking in `dev/scripts/rust/comments/check.mjs`

## Planned

- [ ] Implement `dev/scripts/rust/comments/test.mjs` to verify rules before repository checks
- [ ] Route Rust comment checks through `dev/scripts/rust/test.mjs`
- [ ] Retire `dev/scripts/rust/lint-source-headers.mjs` after migration parity is verified
- [ ] Define the Module Documentation rule and audit backend Rust sources
- [ ] Define the Item Documentation rule and audit backend Rust sources
- [ ] Define the Explanatory Comments rule and audit backend Rust sources
- [ ] Upgrade Rust comment checks with rule-specific parsing and test coverage
- [ ] Finalize the Comments rules in `docs/rules/rust-code-style.md`
- [ ] Define visibility rule categories and audit module item visibility
- [ ] Audit associated item visibility across backend Rust sources
- [ ] Audit reexport visibility chains across backend Rust modules
- [ ] Upgrade Rust visibility checks with structural parsing and test coverage
- [ ] Finalize the Visibility rules in `docs/rules/rust-code-style.md`
- [ ] Converge RDD philosophy discussion and draft ARCHITECTURE.md

## Completed

- [x] Implement and cover the Source File Header rule with rule-level tests
- [x] Define the Source File Header rule in `docs/rules/rust-code-style.md`
- [x] Establish development standards documentation and seed the Rust code style structure
- [x] Polish Provider context propagation, error architecture, and context-derived business scopes
- [x] Decouple Provider scope from failure facts and tighten SettingsFailure visibility
- [x] Make Provider error-context subject projection explicit across business contexts
- [x] Seed a minimal cargo-deny dependency policy as infrastructure groundwork
- [x] Upgrade SettingsError to Context+Failure split, matching Provider pattern
