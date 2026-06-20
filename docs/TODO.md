# Branch TODO

- Branch: feat/spirit-errors-deep
- Goal: Provider backend error system deep dive — typed source chains / issue aggregation, then logging system design (Phase 6.2–6.3)

## Current

- [ ] Provider non-config error field review — continue after the unsupported-provider fallback by upgrading connection health-check `ProviderError` string variants into typed context/source fields one error at a time

## Planned

- [ ] `ProviderError` field-structure pass — complete provider-scoped `String` variants by separating typed context fields from optional `#[source]` causes
- [ ] `ProviderAppError::from` adoption pass — move manager/store call sites away from boundary `with_provider_id` once each `ProviderError` variant can project its own details context
- [ ] `ProviderErrorDetails` projection pass — keep boundary `details` derived from structured `ProviderError` fields rather than service-layer field injection
- [ ] Source display consistency pass — keep source-backed `thiserror` messages focused on domain failure plus `source`, with provider identity carried by details/log context
- [ ] Reset/lifecycle provider context adaptation — make provider task-context attribution self-consistent after the ProviderError context boundary is clarified
- [ ] `ProviderIssue` merge into `ProviderAppError.details` — collapse lifecycle failed payload to a single `error` field and carry provider-scoped related errors as a `ProviderAppError` list in details
- [ ] Domain error context/source checkpoint — evaluate extracting provider error context as a first-class error-system concept after enough variants prove the context/source pattern
- [ ] Error-system architecture note — document the Provider error design: domain error fields, source chains, boundary code/details projection, issue aggregation, and future shared abstractions
- [ ] Logging system kickoff — start with structured log context reuse after the error context model is stable, keeping trace/correlation identifiers in logging rather than current error details

## Completed

- [x] `UnsupportedProvider` typed raw provider context — replaced the free-text fallback with `raw_provider_id`, preserving the unknown boundary classification while removing string-built errors from persisted-provider parsing and connection driver lookup
- [x] Secret store typed context/source chain — upgraded keyring init/read/write/remove failures to carry `provider_id` plus `keyring::Error` source, keeping source-backed Display messages source-focused while allowing reset primary and recovery failures to project provider context from `ProviderError`
- [x] `ConfigStoreOpen` typed context/source chain — upgraded settings store open failures to carry optional provider task context plus `tauri_plugin_store::Error` source, preserving global lifecycle reads while allowing update-chain details projection from `ProviderError`
- [x] Config store atomic write source chain — upgraded temp-create/write/sync/replace failures to carry provider task context plus `std::io::Error` sources through `atomic_write`
- [x] `ConfigStorePath` typed context/source chain — upgraded app-data-dir path resolution failures to carry provider task context plus Tauri `source`, and aligned `JsonSerialize` Display text to avoid duplicating provider context
- [x] `ConfigStoreSerialize` typed context/source chain — upgraded settings store JSON-byte serialization errors to carry provider task context plus serde `source`, keeping store key context deferred until a first-class error context model exists
- [x] `JsonDeserialize` typed context/source chain — upgraded provider config deserialization errors to carry optional provider task context plus serde `source`, preserving global lifecycle reads without pretending the corrupted store belongs to one provider
- [x] `JsonSerialize` typed context/source chain — upgraded provider config serialization errors to carry `provider_id` plus serde `source`, projected `details.providerId` from `ProviderError`, and removed free-text construction from save/update/remove store paths
- [x] `ConfigNotFound` typed provider context — replaced free-text store/config not-found messages with `provider_id`, projected `details.providerId` from `ProviderError`, and updated update/remove store constructors
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
