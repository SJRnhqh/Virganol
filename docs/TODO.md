# Branch TODO

- Branch: feat/spirit-reliability-design
- Goal: Close out Provider reliability architecture (error attribution + context propagation), deliver ARCHITECTURE.md technical design document

## Current

- [ ] Lifecycle error attribution: upgrade status emit / join / aggregate errors to lifecycle context projection

## Planned

- [ ] Provider collection subject attribution: finalize ProviderSubject / ProviderErrorContext, clean up load_provider_check_snapshot fallback
- [ ] Error attribution model upgrade: typed subject for single provider / lifecycle run / collection / subsystem
- [ ] Snapshot context + concurrency review: decide ProviderCheckSnapshot disposition, assess JoinSet / FuturesUnordered impact
- [ ] Fallback logging rules: record core-path fallbacks with existing context, no reinterpretation at command boundary
- [ ] Logging system design discussion (exploration only — trace / correlation / persistence directions)
- [ ] ARCHITECTURE.md reliability sections: Context Propagation / Error Architecture full technical design

## Completed
