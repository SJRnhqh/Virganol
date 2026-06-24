# Branch TODO

- Branch: feat/spirit-context-propagation
- Goal: Backend reliability architecture context propagation design — define the Provider context model and its usage rules across command boundaries, lifecycle flow, error projection, and future observability.

## Current

- [ ] Reset context propagation review — inspect how manager contexts should pass through reset-path store layers (config store, secret store, connection re-check), handling shared lifecycle boundaries (healthcheck), same-business error attribution (ProviderError), and rollback/fallback logging without over-propagating into cross-business paths.

## Completed

- [x] Connect context propagation review — wired manager contexts through config store, secret store, and connection check boundaries on the connect path with conservative scope; `at_secret_store` and `at_connection` stage helpers added to `ProviderManagerContext`.

## Planned

- [ ] Provider context model scope — decide the minimum first-class context fields for Provider reliability work, including provider identity, operation/task intent, lifecycle trigger, snapshot classification, and future correlation/trace compatibility.
- [ ] Context propagation boundary rules — define which layers create, enrich, pass through, project, or intentionally avoid context across commands, managers, services, stores, connection drivers, and lifecycle runner code.
- [ ] Core fallback logging design — specify how Provider core entrypoints should log or report fallback failures using carried context without involving Tauri command handlers or reinterpreting core business errors.
- [ ] Lifecycle trigger context integration — decide whether `ProviderCheckTrigger` remains an independent lifecycle value object or becomes part of the provider lifecycle context.
- [ ] Lifecycle snapshot context integration — decide whether `ProviderCheckSnapshot` remains a standalone classified config snapshot or folds into the provider lifecycle context model.
- [ ] Error projection alignment — document how context propagation should support `ProviderErrorDetails` projection while avoiding duplicated domain fields, string-built errors, or observability-only identifiers in current error details.
- [ ] Observability handoff notes — capture the context fields and boundaries that Phase 6.3 structured logging should reuse, while keeping trace/correlation policy deferred to the observability design.
- [ ] Architecture documentation update — write the accepted context propagation design into `docs/ARCHITECTURE.md` and keep `docs/ROADMAP.md` aligned with completed Phase 6.2 items.

## Completed

- [x] Branch TODO initialized from ROADMAP Phase 6.2 context propagation scope.
- [x] Provider context model scaffolded with private base, operation, stage, and manager-link context types under `core::bot::models::provider::context`.
- [x] Provider manager context creation wired into connect, reset, and update-models manager handlers with context visibility scoped to `core::bot`.
- [x] Provider context stage model narrowed to core-owned stages by removing the Tauri command stage and documenting manager context construction as the private base-context entrypoint.
- [x] Provider error attribution context introduced under the context model and wired into manager payload validation errors through a typed ProviderError constructor.
- [x] Update-models manager context now hands off to the config-store stage before entering the update store function, while keeping business fields explicit and leaving save/remove store paths unchanged.
