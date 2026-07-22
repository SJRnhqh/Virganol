# Branch TODO

- Branch: feat/spirit-reliability-polish
- Goal: Polish Provider reliability architecture — Settings upgrade, policy audit, lint hardening, and architecture documentation

## Current

- [ ] Scaffold the Node/NAPI crate and expose an equivalent source-checking interface

## Planned

- [ ] Design the shared Rust comments workload and adapter contract used by correctness tests and benchmarks
- [ ] Define shared `checkSource(source)` result semantics for CLI and NAPI adapters
- [ ] Implement config-driven NAPI test-environment preparation
- [ ] Define reusable source corpus loading, result normalization, and correctness preflight
- [ ] Add CLI/NAPI parity coverage and a representative adapter comparison benchmark
- [ ] Select the production adapter using correctness, performance, and maintenance evidence
- [ ] Expand Outer Doc Comments fixtures through the shared check interface
- [ ] Design Outer Doc Comments fixture coverage and extend the core parser into structural target discovery
- [ ] Integrate the selected adapter into the Outer Doc Comments rule, tests, and repository check
- [ ] Audit remaining backend Rust sources against the Outer Doc Comments rule
- [ ] Define the Inner Doc Comments rule and audit backend Rust sources
- [ ] Define the Explanatory Comments rule and audit backend Rust sources
- [ ] Finalize the Comments rules in `docs/rules/rust-code-style.md`
- [ ] Define visibility rule categories and audit module item visibility
- [ ] Audit associated item visibility across backend Rust sources
- [ ] Audit reexport visibility chains across backend Rust modules
- [ ] Upgrade Rust visibility checks with structural parsing and test coverage
- [ ] Finalize the Visibility rules in `docs/rules/rust-code-style.md`
- [ ] Converge RDD philosophy discussion and draft ARCHITECTURE.md

## Completed

- [x] Activate the first valid free-function Outer Doc Comments fixture through the shared CLI check and benchmark path
- [x] Scaffold the non-concurrent CLI side of the adapter comparison benchmark with release build, warmup, and summary statistics
- [x] Connect config-driven test-environment preparation to the Outer Doc Comments CLI check facade, with a NAPI placeholder
- [x] Scaffold Outer Doc Comments tests with configurable CLI/NAPI adapter selection
- [x] Centralize Rust comment fixture loading for reusable test and benchmark inputs
- [x] Establish layered repository, Rust, and Rust comments benchmark orchestration behind `pnpm bench`
- [x] Establish a stdin-based CLI adapter that invokes the shared Rust comment checker core
- [x] Establish Outer Doc Comments config and a workspace-managed Rust core crate with a single-source `syn` parsing entrypoint
- [x] Define the Outer Doc Comments targets, excludes, and pattern, and re-audit commands and core/shared Rust sources
- [x] Route Rust comment checks through Rust tests and retire the legacy source-header lint
- [x] Implement Rust comment repository checking and rule-first test orchestration
- [x] Implement and cover the Source File Header rule with rule-level tests
- [x] Define the Source File Header rule in `docs/rules/rust-code-style.md`
- [x] Establish development standards documentation and seed the Rust code style structure
- [x] Polish Provider context propagation, error architecture, and context-derived business scopes
- [x] Decouple Provider scope from failure facts and tighten SettingsFailure visibility
- [x] Make Provider error-context subject projection explicit across business contexts
- [x] Seed a minimal cargo-deny dependency policy as infrastructure groundwork
- [x] Upgrade SettingsError to Context+Failure split, matching Provider pattern
