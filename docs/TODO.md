# Branch TODO

- Branch: feat/spirit-errors-deep
- Goal: Provider error system deep dive — details / thiserror / trace_id / front-end sync / integration tests (Phase 6.4–6.6)

## Current

- [ ] `ProviderErrorDetails` design & implementation — replace PhantomData with structured fields (trace_id, operation_id, nested error source)

## Planned

- [ ] `thiserror` evaluation & migration — auto-derived `source()`, reduce boilerplate
- [ ] `trace_id` / `operation_id` — traceable error chains, log correlation
- [ ] `ProviderIssue` merge into `ProviderAppError` — multiple issues carried via details
- [ ] `message()` retirement — `reset.rs` dual-failure pattern reworked to embed via details
- [ ] Front-end error type sync — mirror `ProviderErrorCode` on the TS side
- [ ] Integration tests — 5 command chains + lifecycle endpoint verification

## Completed

- [x] Dev tooling: `pnpm test` orchestrator with per-stack scripts (Rust: lint + cargo test, TS: eslint)
- [x] Husky pre-commit simplified to `pnpm test` (lint + test in one gate)
