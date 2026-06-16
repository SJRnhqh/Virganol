# Branch TODO

- Branch: feat/spirit-errors-deep
- Goal: Provider error system deep dive — details / thiserror / trace_id / front-end sync / integration tests (Phase 6.4–6.6)

## Current

- [ ] `ProviderErrorDetails` design & implementation — replace PhantomData with structured fields (trace_id, operation_id, nested source / secondary errors)

## Planned

- [ ] `AppError` details carrier — replace marker-only PhantomData with serializable optional details and skip absent details
- [ ] `ProviderError` typed source coverage — replace source-capable `String` variants with typed sources/context so `source()` chains extend beyond serde_json errors
- [ ] `trace_id` / `operation_id` — traceable error chains, log correlation
- [ ] `ProviderIssue` merge into `ProviderAppError` — multiple issues carried via details
- [ ] `message()` retirement — `reset.rs` dual-failure pattern reworked to embed via details
- [ ] `ProviderCheckStatusPayload` boundary fix — replace raw `HealthCheckResult` with a lifecycle-specific type that converts `ProviderError` → `ProviderAppError` before serialization (currently bypasses boundary contract)

## Completed

- [x] Dev tooling: `pnpm test` orchestrator with per-stack scripts (Rust: lint + cargo test, TS: eslint)
- [x] Husky pre-commit simplified to `pnpm test` (lint + test in one gate)
- [x] Go test script added — all three stacks covered by `pnpm test`
- [x] Rust `cargo check` + Go `go vet` added; router reordered Go→Rust→TS
- [x] CI simplified: removed `.github/ci/` shell scripts, `ci.yml` reduced to `pnpm test`
- [x] `ProviderError` migrated to `thiserror` — `#[source]` on 3 serde_json variants, removed 42 lines of manual Display
