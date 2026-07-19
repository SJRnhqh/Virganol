# Branch TODO

- Branch: feat/spirit-reliability-polish
- Goal: Polish Provider reliability architecture — Settings upgrade, policy audit, lint hardening, and architecture documentation

## Current

- [ ] Define the Source File Header rule and audit backend Rust sources

## Planned

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

- [x] Establish development standards documentation and seed the Rust code style structure
- [x] Polish Provider context propagation, error architecture, and context-derived business scopes
- [x] Decouple Provider scope from failure facts and tighten SettingsFailure visibility
- [x] Make Provider error-context subject projection explicit across business contexts
- [x] Seed a minimal cargo-deny dependency policy as infrastructure groundwork
- [x] Upgrade SettingsError to Context+Failure split, matching Provider pattern
