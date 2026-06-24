# Branch TODO

- Branch: feat/spirit-context-propagation
- Goal: Backend reliability architecture context propagation design — define the Provider context model and its usage rules across command boundaries, lifecycle flow, error projection, and future observability.

## Current

- [ ] Provider manager context propagation design — define how manager contexts created in connect, reset, and update-models should be passed, borrowed, or projected across store, connection, and error boundaries while keeping commands out of the context lifecycle.

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
