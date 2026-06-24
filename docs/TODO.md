# Branch TODO

- Branch: feat/spirit-context-propagation
- Goal: Backend reliability architecture context propagation design — define the Provider context model and its usage rules across command boundaries, lifecycle flow, error projection, and future observability.

## Current

- [ ] Provider context architecture design — keep the lifecycle runner ctx handoff intentionally narrow for now, then define how Provider-domain business contexts sit on top of the generic `ProviderContext` base with clear responsibility seams, delegation/conversion contracts, and shared provider-scoped attribution.

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
