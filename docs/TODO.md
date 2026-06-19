# Branch TODO

- Branch: feat/spirit-errors-deep
- Goal: Provider backend error system deep dive — typed source chains / issue aggregation, then logging system design (Phase 6.2–6.3)

## Current

- [ ] Connect/update provider context review — continue migrating provider-scoped manager errors from boundary-level `ProviderAppError::with_provider_id` projection into typed `ProviderError` context/source fields one error at a time

## Planned

- [ ] Reset/lifecycle provider context adaptation — make provider task-context attribution self-consistent after the ProviderError context boundary is clarified
- [ ] `ProviderIssue` merge into `ProviderAppError.details` — collapse lifecycle failed payload to a single `error` field and carry provider-scoped related errors as a `ProviderAppError` list in details
- [ ] `ProviderError` internal cause chain — replace source-capable `String` variants with typed sources/context so `source()` chains extend beyond serde_json errors
- [ ] Domain error context/source checkpoint — keep typed `ProviderError` fields split between structured context and optional source causes, then evaluate a shared context/source abstraction before the logging system pass if repetition stabilizes
- [ ] Logging system handoff — defer trace/correlation identifiers to the logging context design instead of modeling them in the current error-system pass

## Completed

- [x] `ManagerRequestPayloadAbsent` typed provider context — replaced free-text `String` with `provider_id`, projected `details.providerId` from `ProviderError`, and moved connect/update missing-payload responses onto `ProviderAppError::from`
- [x] `ProviderErrorDetails.providerId` scaffold — added optional provider task context to Provider boundary details and centralized ProviderAppError construction through projected details
- [x] Connect/update provider context projection scaffold — attached `providerId` to connect and update boundary errors as an interim boundary projection while deeper ProviderError context modeling remains open
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
