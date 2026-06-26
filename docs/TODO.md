# Branch TODO

- Branch: feat/spirit-context-propagation
- Goal: Backend reliability architecture context propagation design — define the Provider context model and its usage rules across command boundaries, lifecycle flow, error projection, and future observability.

## Current

- [ ] Provider collection subject attribution integration — apply typed Provider-domain subjects to collection-level config loading paths such as `load_all_providers`, then decide when `ProviderErrorContext` should carry full subject semantics instead of only optional provider-id projection.

## Planned

- [ ] Provider context model scope — decide the minimum first-class context fields for Provider reliability work, including provider identity, operation/task intent, lifecycle trigger, snapshot classification, and future correlation/trace compatibility.
- [ ] Context propagation boundary rules — define which layers create, enrich, pass through, project, or intentionally avoid context across commands, managers, services, stores, connection drivers, and lifecycle runner code.
- [ ] Provider context responsibility seams — define the smaller business-context blocks inside the Provider domain, including lifecycle-owned context, manager-owned context, provider-scoped shared operation context, and the delegation/conversion contracts between them for error and logging attribution.
- [ ] Provider-scoped attribution shape — decide whether provider identity remains a shared base-context field, moves into a provider-scoped extra/context shape, or is introduced through explicit lifecycle/manager-to-provider context conversion.
- [ ] Lifecycle runner concurrency decision — defer the `JoinSet` versus `FuturesUnordered` implementation choice until lifecycle-to-provider context conversion semantics are settled, then evaluate the concurrency primitive against ownership, lifetime, cancellation, panic isolation, and error attribution requirements.
- [ ] Core fallback logging design — specify how Provider core entrypoints should log or report fallback failures using carried context without involving Tauri command handlers or reinterpreting core business errors.
- [ ] Lifecycle trigger context integration — decide whether `ProviderCheckTrigger` remains an independent lifecycle value object or becomes part of the provider lifecycle context.
- [ ] Provider error attribution model — replace the current optional provider-id attribution with a typed attribution model, distinguishing single-provider, lifecycle-run, provider-collection, and subsystem/global failures while keeping boundary details stable.
- [ ] Error projection alignment — document how context propagation should support `ProviderErrorDetails` projection while avoiding duplicated domain fields, string-built errors, or observability-only identifiers in current error details.
- [ ] Observability handoff notes — capture the context fields and boundaries that Phase 6.3 structured logging should reuse, while keeping trace/correlation policy deferred to the observability design.
- [ ] Architecture documentation update — write the accepted context propagation design into `docs/ARCHITECTURE.md` and keep `docs/ROADMAP.md` aligned with completed Phase 6.2 items.

## Completed

- [x] Store layer ctx parameter plumbing — `save_provider`, `remove_provider_key`, `save_provider_key`, `load_provider_key`, `load_provider_env`, `resolve_provider_key`, `update_models` all wired with `&ProviderExecutionContext`; resolve passes ctx through to env/keyring sub-functions
- [x] Connection layer ctx wiring — `probe_provider_connection` and `health_check_with_resolved_key` use `for_secret_store()` small-scope fork for key resolution
- [x] Transaction ctx ownership pattern — `ProviderKeyTransaction` owns `ProviderExecutionContext`, `begin()` takes owned ctx, Drop uses `&self.ctx` for `save_provider_key`/`remove_provider_key` calls
- [x] Manager chain refinements — reset `into_config_store()` scoped inside rollback `if let Some(record)` block, connect `for_secret_store()` block scope for transaction fork
- [x] Subject-driven context switching — `ProviderExecutionContext::from_parts` widened from `ProviderId` to `ProviderSubject`; `ProviderSubject::configured_providers()` constructor added; lifecycle gains `for_config_store()` and `into_execution_context()`; manager and lifecycle callers unified on `provider_id.into()` / `configured_providers()`
- [x] Model layer normalization — base `impl<E>` before `impl<E: Clone>`, `into_stage`→`to_stage`; execution `into_*` before `for_*`; `from_operation`→`from_parts`; `LifecycleExtra` derives `Clone`
- [x] Lifecycle ↔ execution boundary — flow.rs snapshot loading now forks via `for_config_store().into_execution_context()`; lifecycle ctx stays at `LifecycleEmit`; `load_provider_check_snapshot` signature switched to `&ProviderExecutionContext`; two dead `into_lifecycle_emit()` calls removed
- [x] Re-exports supplemented — `ProviderKeySource`, `ProviderResolvedKey` added to `core::bot`
- [x] Provider execution subject attribution bridge — exposed `ProviderSubject` within the Provider domain, upgraded execution-context extra attribution from raw `ProviderId` to `ProviderSubject`, and added optional provider-id projection so execution error contexts remain compatible with the current `ProviderErrorContext` shape.
- [x] Provider common element/guard structure seeded — moved `ProviderId` under `common::element`, moved runtime `ProviderState` under `common::guard`, and introduced a private minimal `ProviderSubject` with single-provider and configured-provider collection variants for the next typed attribution step.
- [x] Provider context stage transition API split — `ProviderContext` now separates consuming stage transitions (`into_*`) from owned stage-view derivation (`for_*`); `ProviderExecutionContext` exposes provider-scoped `for_*` views for reusable execution attribution while manager/lifecycle contexts keep consuming `into_*` transitions; connect, reset, update-models, and lifecycle flow call sites migrated away from `at_*`; provider-scoped connection/config store entrypoints now receive `ProviderExecutionContext` where the current branch scope already needs execution attribution.
- [x] Provider stage model flattened — `ProviderExecutionStage` removed; `Connection`, `ConfigStore`, and `SecretStore` are now direct `ProviderStage` variants, eliminating the nested `Execution(ProviderExecutionStage)` representation and simplifying stage-to-context mapping.
- [x] Context conversion `Option` eliminated — `execution_context_for()` and `into_execution_context()` now return their target context directly instead of `Option<…>`, since `from_operation()` already accepts any `ProviderStage` value and stage validity is a caller-level contract.
- [x] Context field semantics clarified — `ProviderContext.stage` renamed to "business execution stage" with positioning semantics; `extra` renamed to "module-specific domain business context fields".
- [x] Provider execution context scaffold refined — `ProviderExecutionContext` now models provider-scoped shared execution handoff from lifecycle and manager contexts, keeps execution stage classification private to the context module, and inherits the current stage before projecting provider attribution.
- [x] Provider context base responsibility narrowed — `ProviderContext<T>` now keeps shared stage/extra state private, exposes narrow construction/access/projection methods, and leaves provider attribution and operation intent to business-specific context extras.
- [x] Provider context operation and stage constructors aligned — manager operations and Provider stages now use named constructors; execution operation typing is scaffolded for future shared provider-scoped context handoff while retaining the context-module self re-export.
- [x] Interactive manager-owned context propagation baseline — connect, reset, and update-models direct manager paths now create and carry `ProviderManagerContext`; non-reuse manager-owned propagation is complete, while shared store/secret/connection reuse semantics remain tracked separately.
- [x] Pure lifecycle context propagation baseline — lifecycle started/completed/failed event emission, lifecycle failure reporting, snapshot-load ctx handoff, and fallback logging now use `ProviderLifecycleContext`; provider-scoped runner handoff remains separate work.
- [x] Lifecycle runner borrowed context handoff — `check_providers_lifecycle` now passes `ProviderLifecycleContext` into `run_provider_checks` by reference as a narrow entrypoint while provider-scoped context architecture remains under design.
- [x] Lifecycle failure reporting context slice — lifecycle flow now passes `ProviderLifecycleContext` into failure reporting and failed-event emission; `CheckFailedEmit` projects `ProviderErrorContext`, fallback logs read run metadata from ctx, and fallback logging is no longer modeled as a Provider execution stage.
- [x] Lifecycle started event context attribution — lifecycle flow now creates a borrowed `ProviderLifecycleContext`, passes it into started-event emission, and projects `ProviderErrorContext` into `CheckStartedEmit` without exposing lifecycle-only `run_id`/`trigger` through boundary details.
- [x] Provider lifecycle context model — `ProviderLifecycleContext` with `LifecycleExtra { run_id, trigger }`; shares `ProviderContext<T>` base with manager; `at_stage`/`error_context`/stage derivations unified in base and delegated by both wrappers.
- [x] Connect context propagation review — wired manager contexts through config store, secret store, and connection check boundaries on the connect path with conservative scope; `at_secret_store` and `at_connection` stage helpers added to `ProviderManagerContext`.
- [x] CheckCompletedEmit context alignment — completed lifecycle event now carries `ProviderErrorContext`, matching started/failed event attribution and completing the emit error projection set.
- [x] Stage ordering normalization — `LifecycleEmit` and `Connection` stages moved to logical position directly after `Manager` in enum definition, method order, and match arms.
- [x] Lifecycle snapshot context integration resolved — snapshot stays standalone value object; `load_provider_check_snapshot` reserves ctx signature for future error attribution without coupling snapshot structure to context model.
- [x] Branch TODO initialized from ROADMAP Phase 6.2 context propagation scope.
- [x] Provider context model scaffolded with private base, operation, stage, and manager-link context types under `core::bot::models::provider::context`.
- [x] Provider manager context creation wired into connect, reset, and update-models manager handlers with context visibility scoped to `core::bot`.
- [x] Provider context stage model narrowed to core-owned stages by removing the Tauri command stage and documenting manager context construction as the private base-context entrypoint.
- [x] Provider error attribution context introduced under the context model and wired into manager payload validation errors through a typed ProviderError constructor.
- [x] Update-models manager context now hands off to the config-store stage before entering the update store function, while keeping business fields explicit and leaving save/remove store paths unchanged.
