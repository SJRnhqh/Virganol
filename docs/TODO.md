# Branch TODO

- Branch: feat/spirit-reliability-design
- Goal: Close out Provider reliability architecture (error attribution + context propagation), deliver ARCHITECTURE.md technical design document

## Current

- [ ] Visibility discipline enforcement: design configurable Rust visibility lint coverage for pub(in ...) / pub(self) / pub(super) rules, re-export chain tightness, and command item visibility

## Planned

- [ ] Rust visibility policy scanner design: prefer a syn-based AST scanner for visibility and re-export coverage; keep tree-sitter-rust as a fallback if exact source ranges, comment formatting, or tolerant parsing become more important during design
- [ ] Rust item doc comment policy scanner design: keep the existing MJS script as the orchestration entrypoint, but evaluate moving strict item-doc rules into a Rust/syn scanner that can inspect free functions, structs, enums, traits, type aliases, const/static items, macro_rules, inherent impl methods, and trait method definitions
- [ ] Rust item doc comment lint coverage expansion: add enum, type alias, macro_rules, impl methods, trait methods, and other needed item kinds after the item-doc scanner design stabilizes
- [ ] Error attribution model upgrade: typed subject for single provider, lifecycle run, provider collection, and subsystem-level failures; keep boundary details stable
- [ ] Error boundary contract: split error out of response payload — ProviderAppError as a standalone boundary field instead of nested inside the response wrapper
- [ ] Logging system design discussion (exploration only — trace / correlation / persistence directions)
- [ ] ARCHITECTURE.md reliability sections: Context Propagation / Error Architecture full technical design

## Completed

- [x] Commands layer comment normalization: initially normalized command boundary doc comments against the item-doc-comment lint coverage
- [x] Rust item doc comment lint: initially added configurable commands-layer coverage for English / blank / Chinese item doc comments, with exact Chinese-line term allowlist
- [x] Lifecycle error attribution: initially upgraded status emit, join, and aggregate errors to lifecycle context projection
- [x] Lifecycle comment cleanup: initially normalized touched runner/finalize Chinese comments
- [x] Provider collection subject attribution: initially completed Subject→Candidate variant, ProviderErrorContext→ProviderSubject, load_provider_check_snapshot context wiring, TryFrom→parse decoupling
