# Branch TODO

- Branch: feat/spirit-reliability-design
- Goal: Close out Provider reliability architecture (error attribution + context propagation), deliver ARCHITECTURE.md technical design document

## Current

- [ ] Error boundary contract follow-up: align lifecycle failure code/details and frontend failed-event payload after context propagation

## Planned

- [ ] Error attribution model upgrade: typed subject for lifecycle run / subsystem
- [ ] Snapshot context + concurrency review: decide ProviderCheckSnapshot disposition, assess JoinSet / FuturesUnordered impact
- [ ] Fallback logging rules: record core-path fallbacks with existing context, no reinterpretation at command boundary
- [ ] Logging system design discussion (exploration only — trace / correlation / persistence directions)
- [ ] ARCHITECTURE.md reliability sections: Context Propagation / Error Architecture full technical design

## Completed

- [x] Lifecycle error attribution: upgraded status emit, join, and aggregate errors to lifecycle context projection
- [x] Lifecycle comment cleanup: normalized touched runner/finalize Chinese comments
- [x] Provider collection subject attribution: Subject→Candidate variant, ProviderErrorContext→ProviderSubject, load_provider_check_snapshot context wiring, TryFrom→parse decoupling
