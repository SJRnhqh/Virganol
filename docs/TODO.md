# Branch TODO

- Branch: feat/spirit-errors-deep
- Goal: Provider error system deep dive — details / thiserror / trace_id / front-end sync / integration tests (Phase 6.4–6.6)

## Current

- [ ] `ProviderErrorDetails` remaining fields — continue structured details beyond `domainScope` for multi-provider issues and front-end-safe diagnostics

## Planned

- [ ] `ProviderError` typed source coverage — replace source-capable `String` variants with typed sources/context so `source()` chains extend beyond serde_json errors
- [ ] `trace_id` / `operation_id` — traceable error chains, log correlation
- [ ] `ProviderIssue` merge into `ProviderAppError` — multiple issues carried via details

## Completed

- [x] `ProviderErrorDetails` recoveryFailure field — modeled reset recovery failures as nested `ProviderAppError` details without changing normal single-error projection
- [x] `reset.rs` transitional `with_message` gap — replaced custom dual-error message construction with details-based recovery failure modeling
- [x] `ProviderAppError` cleanup — removed transitional `with_message` and kept recovery failure construction behind a semantic boundary helper
- [x] `message()` retirement — removed the reset-only `ProviderError::message()` helper after dual-failure embedding moved into details
- [x] `ProviderErrorCode` visibility cleanup — confined provider boundary code mapping to the error module
- [x] Dev tools workspace — added `dev/tools` Python project scaffolding with `headroom-ai[mcp]`
- [x] `AppError` details carrier — replaced marker-only `PhantomData` with a required serializable details field
- [x] `ProviderErrorDetails` scaffold — introduced `domainScope` and a field-level projection shell from `ProviderError`
- [x] `ProviderErrorDetails` domainScope mapping — mapped manager, lifecycle, connection, store/config, and store/secret errors to stable Provider domain scopes while keeping unsupported provider errors on the unknown fallback
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
