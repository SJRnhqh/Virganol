# Branch TODO

- Branch: feat/spirit-reliability-design
- Goal: Close out Provider reliability architecture (error attribution + context propagation), deliver ARCHITECTURE.md technical design document

## Current

- [ ] Commands layer comment normalization: repair command doc comments against the new item-doc-comment lint coverage
- [ ] Visibility discipline enforcement: design configurable Rust visibility lint coverage for pub(in ...) / pub(self) / pub(super) rules

## Planned

- [ ] Error attribution model upgrade: typed subject for single provider, lifecycle run, provider collection, and subsystem-level failures; keep boundary details stable
- [ ] Error boundary contract: split error out of response payload — ProviderAppError as a standalone boundary field instead of nested inside the response wrapper
- [ ] Logging system design discussion (exploration only — trace / correlation / persistence directions)
- [ ] ARCHITECTURE.md reliability sections: Context Propagation / Error Architecture full technical design

## Completed

- [x] Rust item doc comment lint: added configurable commands-layer coverage for English / blank / Chinese item doc comments, with exact Chinese-line term allowlist
- [x] Lifecycle error attribution: upgraded status emit, join, and aggregate errors to lifecycle context projection
- [x] Lifecycle comment cleanup: normalized touched runner/finalize Chinese comments
- [x] Provider collection subject attribution: Subject→Candidate variant, ProviderErrorContext→ProviderSubject, load_provider_check_snapshot context wiring, TryFrom→parse decoupling
