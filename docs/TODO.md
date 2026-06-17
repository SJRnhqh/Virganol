# Branch TODO

- Branch: feat/spirit-errors-deep
- Goal: Provider error system deep dive — details / thiserror / trace_id / front-end sync / integration tests (Phase 6.4–6.6)

## Current

- [ ] `ProviderErrorDetails` domainScope mapping — replace the `provider.unknown` fallback with variant-level Provider domain scopes
- [ ] `reset.rs` transitional `with_message` gap — replace custom boundary-message construction with details-based dual-error modeling

## Planned

- [ ] `ProviderAppError` cleanup — remove transitional `with_message` after reset dual-error details can replace custom boundary messages
- [ ] `ProviderError` typed source coverage — replace source-capable `String` variants with typed sources/context so `source()` chains extend beyond serde_json errors
- [ ] `trace_id` / `operation_id` — traceable error chains, log correlation
- [ ] `ProviderIssue` merge into `ProviderAppError` — multiple issues carried via details
- [ ] `message()` retirement — `reset.rs` dual-failure pattern reworked to embed via details

## Completed

- [x] `AppError` details carrier — replaced marker-only `PhantomData` with a required serializable details field
- [x] `ProviderErrorDetails` scaffold — introduced `domainScope` and a field-level projection shell from `ProviderError`
- [x] Manager request payload error routing — added `ManagerRequestPayloadAbsent`, mapped it to `missing_request_data`, and routed connect/update payload failures through `ProviderError`
- [x] `ProviderCheckStatusPayload` boundary fix — projected lifecycle status through a private contract adapter so serialized status carries `ProviderAppError` instead of raw `ProviderError`
- [x] Dev tooling: `pnpm test` orchestrator with per-stack scripts (Rust: lint + cargo test, TS: eslint)
- [x] Rust CI sidecar preflight — build the Tauri external sidecar before `cargo check` / `cargo test`
- [x] CI timeout budget — extend Rust suite and Rust build-step timeouts for cold GitHub Actions builds
- [x] CI action runtime readiness — upgrade official GitHub actions to Node 24-compatible majors
- [x] Husky pre-commit simplified to `pnpm test` (lint + test in one gate)
- [x] Go test script added — all three stacks covered by `pnpm test`
- [x] Rust `cargo check` + Go `go vet` added; router reordered Go→Rust→TS
- [x] CI simplified: removed `.github/ci/` shell scripts, `ci.yml` reduced to `pnpm test`
- [x] `ProviderError` migrated to `thiserror` — `#[source]` on 3 serde_json variants, removed 42 lines of manual Display
