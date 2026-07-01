# Branch TODO

- Branch: feat/spirit-context-propagation
- Goal: Backend reliability architecture context propagation design — define the Provider context model and its usage rules across command boundaries, lifecycle flow, error projection, and future observability.

## Current

- [ ] Lifecycle error attribution cleanup — upgrade status, join, and aggregate errors to lifecycle-aware context/projection.
- [ ] Provider collection subject attribution — apply typed `ProviderSubject` to collection-level paths such as `load_all_providers`; decide when `ProviderErrorContext` should carry full subject semantics

## Planned

- [ ] Architecture design closeout — document accepted Provider context fields, propagation boundaries, Provider/Settings responsibility split, and error projection rules.
- [ ] Lifecycle runner concurrency decision — defer the `JoinSet` versus `FuturesUnordered` implementation choice until lifecycle-to-provider context conversion semantics are settled, then evaluate the concurrency primitive against ownership, lifetime, cancellation, panic isolation, and error attribution requirements.
- [ ] Core fallback logging design — specify how Provider core entrypoints should log or report fallback failures using carried context without involving Tauri command handlers or reinterpreting core business errors.
- [ ] Lifecycle trigger context integration — decide whether `ProviderCheckTrigger` remains an independent lifecycle value object or becomes part of the provider lifecycle context.
- [ ] Provider error attribution model — replace the current optional provider-id attribution with a typed attribution model, distinguishing single-provider, lifecycle-run, provider-collection, and subsystem/global failures while keeping boundary details stable.
- [ ] Observability handoff notes — capture the context fields and boundaries that Phase 6.3 structured logging should reuse, while keeping trace/correlation policy deferred to the observability design.
- [ ] Rust visibility guardrail lint — after the context/error design and technical docs settle, consider an optional MJS architecture lint that checks functions, structs, impl methods, and re-export chains do not expose a wider module scope than their declared visibility; treat this as discipline-oriented, non-blocking codebase hygiene.
- [ ] Architecture documentation update — write the accepted context propagation design into `docs/ARCHITECTURE.md` and keep `docs/ROADMAP.md` aligned with completed Phase 6.2 items.

## Completed

- [x] Provider settings interactive chains closed — connect/reset/update now pass staged context through health, config, and secret errors; built-in health routing is exhaustive.
- [x] Provider settings reset chain reviewed — manager reset, provider config remove/save, and provider secret remove paths now use staged execution context/error projection for reset-owned failures, with rollback suppression semantics preserved.
- [x] Provider settings update chain reviewed — manager update, provider config load/update, and common settings load/save paths now have validated context/error propagation boundaries and normalized bilingual function comments.
- [x] Provider context model landed — `ProviderContext<T>` / `ProviderStage` / lifecycle-manager-execution contexts now carry Provider business stage, operation intent, lifecycle trigger/run metadata, and typed `ProviderSubject` attribution.
- [x] Context propagation wired through main paths — manager, lifecycle, execution, store, connection, and key transaction paths now pass or derive typed Provider contexts instead of rebuilding raw attribution fields at call sites.
- [x] Settings common boundary stabilized — common settings store code is Provider-agnostic, owns `SettingsStorageContext` / `SettingsError`, and no longer accepts `ProviderId` or emits Provider-domain store errors directly.
- [x] Provider settings error projection stabilized — Provider config CRUD paths project settings-owned failures through `ProviderError::ConfigStore { context, source }`; config/json errors now use `ProviderErrorContext`, and legacy `ConfigStore*` variants were removed.
- [x] Model API and visibility normalized — context conversion APIs, constructor naming, stage ordering, error-context projection sites, re-exports, and visibility were tightened so callers use specific context references rather than constructing error snapshots directly.
