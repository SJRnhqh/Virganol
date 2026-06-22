# Branch TODO

- Branch: feat/spirit-context-propagation
- Goal: Backend reliability architecture context propagation design — define the Provider context model and its usage rules across command boundaries, lifecycle flow, error projection, and future observability.

## Current

- [ ] Context propagation design — define the backend reliability context model that can carry provider/task/lifecycle context across Provider services without turning error details or logs into duplicated ad hoc context stores.

## Planned

- [ ] Provider context model scope — decide the minimum first-class context fields for Provider reliability work, including provider identity, operation/task intent, lifecycle trigger, snapshot classification, and future correlation/trace compatibility.
- [ ] Context propagation boundary rules — define which layers create, enrich, pass through, project, or intentionally avoid context across commands, managers, services, stores, connection drivers, and lifecycle runner code.
- [ ] Command boundary fallback logging design — specify how Tauri command boundaries should log fallback failures using carried context without reinterpreting core business errors.
- [ ] Lifecycle trigger context integration — decide whether `ProviderCheckTrigger` remains an independent lifecycle value object or becomes part of the provider lifecycle context.
- [ ] Lifecycle snapshot context integration — decide whether `ProviderCheckSnapshot` remains a standalone classified config snapshot or folds into the provider lifecycle context model.
- [ ] Error projection alignment — document how context propagation should support `ProviderErrorDetails` projection while avoiding duplicated domain fields, string-built errors, or observability-only identifiers in current error details.
- [ ] Observability handoff notes — capture the context fields and boundaries that Phase 6.3 structured logging should reuse, while keeping trace/correlation policy deferred to the observability design.
- [ ] Architecture documentation update — write the accepted context propagation design into `docs/ARCHITECTURE.md` and keep `docs/ROADMAP.md` aligned with completed Phase 6.2 items.

## Completed

- [x] Branch TODO initialized from ROADMAP Phase 6.2 context propagation scope.
