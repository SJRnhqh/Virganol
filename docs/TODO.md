# Branch TODO

- Branch: feat/spirit-context-propagation
- Goal: Backend reliability architecture context propagation design — define the Provider context model and its usage rules across command boundaries, lifecycle flow, error projection, and future observability.

## Current

- [ ] Store error attribution cleanup — upgrade `CheckStatusEmit` from raw `provider_id` to `ProviderErrorContext`
- [ ] Provider collection subject attribution — apply typed `ProviderSubject` to collection-level paths such as `load_all_providers`; decide when `ProviderErrorContext` should carry full subject semantics

## Planned

- [ ] Provider context model scope — decide the minimum first-class context fields for Provider reliability work, including provider identity, operation/task intent, lifecycle trigger, snapshot classification, and future correlation/trace compatibility.
- [ ] Context propagation boundary rules — define which layers create, enrich, pass through, project, or intentionally avoid context across commands, managers, services, stores, connection drivers, and lifecycle runner code.
- [ ] Provider context responsibility seams — define the smaller business-context blocks inside the Provider domain, including lifecycle-owned context, manager-owned context, provider-scoped shared operation context, and the delegation/conversion contracts between them for error and logging attribution.
- [ ] Lifecycle runner concurrency decision — defer the `JoinSet` versus `FuturesUnordered` implementation choice until lifecycle-to-provider context conversion semantics are settled, then evaluate the concurrency primitive against ownership, lifetime, cancellation, panic isolation, and error attribution requirements.
- [ ] Core fallback logging design — specify how Provider core entrypoints should log or report fallback failures using carried context without involving Tauri command handlers or reinterpreting core business errors.
- [ ] Lifecycle trigger context integration — decide whether `ProviderCheckTrigger` remains an independent lifecycle value object or becomes part of the provider lifecycle context.
- [ ] Provider error attribution model — replace the current optional provider-id attribution with a typed attribution model, distinguishing single-provider, lifecycle-run, provider-collection, and subsystem/global failures while keeping boundary details stable.
- [ ] Error projection alignment — document how context propagation should support `ProviderErrorDetails` projection while avoiding duplicated domain fields, string-built errors, or observability-only identifiers in current error details.
- [ ] Observability handoff notes — capture the context fields and boundaries that Phase 6.3 structured logging should reuse, while keeping trace/correlation policy deferred to the observability design.
- [ ] Architecture documentation update — write the accepted context propagation design into `docs/ARCHITECTURE.md` and keep `docs/ROADMAP.md` aligned with completed Phase 6.2 items.

## Completed

- [x] Provider context model landed — `ProviderContext<T>` private base, `ProviderStage` flattened (no `ProviderExecutionStage`), three context types (`ProviderLifecycleContext` / `ProviderManagerContext` / `ProviderExecutionContext`) stabilized, stage semantics and field naming clarified, constructors aligned, `ProviderSubject` introduced and wired as typed attribution bridge
- [x] Manager context end-to-end — connect / reset / update-models paths carry `ProviderManagerContext` through stage transitions (`at_secret_store` / `at_connection` / `into_config_store`)
- [x] Lifecycle context end-to-end — `ProviderLifecycleContext` with `LifecycleExtra { run_id, trigger }` flows through started/completed/failed event emission, failure reporting, and fallback logging; snapshot kept standalone; runner receives lifecycle ctx by borrowed reference
- [x] Execution context propagation — `ProviderExecutionContext` carries provider-scoped handoff from lifecycle/manager; `from_parts` driven by `ProviderSubject`; lifecycle sites unify on `for_config_store` / `for_connection` → `into_execution_context_with(subject)`
- [x] Store layer ctx plumbing — all persistence functions receive `&ProviderExecutionContext`, resolve threads through to env/keyring sub-functions; `ProviderKeyTransaction` owns ctx, Drop reuses `&self.ctx`
- [x] Connection layer ctx wiring — `probe_provider_connection` / `health_check_with_resolved_key` use `for_secret_store()` small-scope fork
- [x] Settings error system — `SettingsError` expanded from `StoreOpen` scaffold to full variants (open / path-resolution / serialize / temp-file / write / sync / atomic-replace); `SettingsStorageContext` carries `SettingsStage`, projects `SettingsErrorContext`; common load/save helpers switched from `ProviderError::ConfigStore*` to `SettingsError` typed constructors
- [x] Provider config error context projection — `ConfigNotFound` / `JsonSerialize` / `JsonDeserialize` upgraded from raw `provider_id` to `ProviderErrorContext`, config CRUD failure sites project via `ctx.error_context()`
- [x] Settings storage error projection boundary — `ProviderError::ConfigStore { context, source }` defined as unified projection variant; `config_store(ctx, source)` constructor in place; `details.rs` domain_scope_from inner-matches `*SettingsError` to preserve per-stage granularity; `code.rs` maps `ConfigStore` to `ConfigStoreFailed`
- [x] Model layer normalization — stage order normalized (`LifecycleEmit` / `Connection` after `Manager`), `into_*` / `for_*` API split (no `at_*`), `Option` removed from context conversions, `impl<E>` before `impl<E: Clone>`, `into_stage`→`to_stage`, `from_operation`→`from_parts`, `LifecycleExtra: Clone`, `ProviderSubject` method order normalized; all emit payloads carry `ProviderErrorContext`; re-exports supplemented
- [x] ProviderErrorContext visibility tightened — tightened from `pub(in crate::core::bot)` to `pub(in super::super::super)` at struct level, `context/mod.rs` opens `mod error` as `pub(super)` and re-exports internally as `pub(self)`, `provider/mod.rs` splits `ProviderErrorContext` out as `pub(self) use`
- [x] Settings→Provider error boundary wired (load/save) — `config_store` projection applied at `load_all_providers` and `save_provider` boundary sites; `remove_provider` / `update_models` deferred until `ProviderErrorContext` visibility resolved
- [x] Settings→Provider error boundary wired — all 4 Provider config boundary sites use consistent `if let Err(e) { ctx.for_settings_storage() → call } { return config_store(ctx, e) }` pattern
- [x] `error_context` projection internalized — all 8 `ProviderError` constructors accept specific context reference instead of `ProviderErrorContext`; projection call moved inside constructor; services layer zero direct references to `ProviderErrorContext`; `error_context()` methods tightened to `pub(in crate::core::bot::models::provider)`
- [x] Legacy ConfigStore* variants removed — 7 superseded `ConfigStoreOpen` / `ConfigStorePath` / `ConfigStoreSerialize` / `ConfigStoreTempCreate` / `ConfigStoreWrite` / `ConfigStoreSync` / `ConfigStoreReplace` variants deleted from `ProviderError` enum; match arms cleaned from `details.rs` and `code.rs`; unused `IoError` / `StoreError` imports dropped
- [x] `SettingsErrorContext` visibility tightened — `pub(in crate::core::bot)` → `pub(in crate::core::bot::models::process::settings)`; `error_context()` projection pushed inside `SettingsError` constructors; common store layer passes `&SettingsStorageContext` instead of `SettingsErrorContext`; removed from upstream re-exports
- [x] Error context types visibility relaxed — `ProviderErrorContext` and `SettingsErrorContext` widened back to `pub(in crate::core::bot)` to eliminate `private_interfaces` warnings on enum fields; re-exports kept tight (`pub(super)`/`pub(self)`) since external code never names these types directly
