# Branch TODO

- Branch: feat/spirit-context-propagation
- Goal: Backend reliability architecture context propagation design — define the Provider context model and its usage rules across command boundaries, lifecycle flow, error projection, and future observability.

## Current

No active branch-local items. Deferred lifecycle/context follow-ups are tracked in `docs/ROADMAP.md`.

## Planned

No branch-local planned items.

## Completed

- [x] Provider settings interactive chains closed — connect/reset/update now pass staged context through health, config, and secret errors; built-in health routing is exhaustive.
- [x] Provider settings reset chain reviewed — manager reset, provider config remove/save, and provider secret remove paths now use staged execution context/error projection for reset-owned failures, with rollback suppression semantics preserved.
- [x] Provider settings update chain reviewed — manager update, provider config load/update, and common settings load/save paths now have validated context/error propagation boundaries and normalized bilingual function comments.
- [x] Provider context model landed — `ProviderContext<T>` / `ProviderStage` / lifecycle-manager-execution contexts now carry Provider business stage, operation intent, lifecycle trigger/run metadata, and typed `ProviderSubject` attribution.
- [x] Context propagation wired through main paths — manager, lifecycle, execution, store, connection, and key transaction paths now pass or derive typed Provider contexts instead of rebuilding raw attribution fields at call sites.
- [x] Settings common boundary stabilized — common settings store code is Provider-agnostic, owns `SettingsStorageContext` / `SettingsError`, and no longer accepts `ProviderId` or emits Provider-domain store errors directly.
- [x] Provider settings error projection stabilized — Provider config CRUD paths project settings-owned failures through `ProviderError::ConfigStore { context, source }`; config/json errors now use `ProviderErrorContext`, and legacy `ConfigStore*` variants were removed.
- [x] Model API and visibility normalized — context conversion APIs, constructor naming, stage ordering, error-context projection sites, re-exports, and visibility were tightened so callers use specific context references rather than constructing error snapshots directly.
