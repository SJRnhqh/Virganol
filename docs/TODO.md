# Branch TODO

- Branch: feat/spirit-reliability-design
- Goal: Close out Provider reliability architecture (error attribution + context propagation), deliver ARCHITECTURE.md technical design document

## Current

## Planned

- [ ] Error attribution model upgrade: typed subject for single provider, lifecycle run, provider collection, and subsystem-level failures; keep boundary details stable
- [ ] Error boundary contract: split error out of response payload — ProviderAppError as a standalone boundary field instead of nested inside the response wrapper
- [ ] Logging system design discussion (exploration only — trace / correlation / persistence directions)
- [ ] ARCHITECTURE.md reliability sections: Context Propagation / Error Architecture full technical design

## Completed

- [x] Lifecycle error attribution: upgraded status emit, join, and aggregate errors to lifecycle context projection
- [x] Lifecycle comment cleanup: normalized touched runner/finalize Chinese comments
- [x] Provider collection subject attribution: Subject→Candidate variant, ProviderErrorContext→ProviderSubject, load_provider_check_snapshot context wiring, TryFrom→parse decoupling
