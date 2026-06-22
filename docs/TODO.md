# Branch TODO

- Branch: feat/spirit-errors-deep
- Goal: Provider backend error system deep dive — typed source chains / issue aggregation, then logging system design (Phase 6.2–6.3)

## Current

- [ ] Backend core services review — finish provider lifecycle services review,
  then resume Context Propagation design

## Planned

- [ ] Context propagation design — define the reliability context model that
  underpins error architecture, observability, and testing strategy
- [ ] Error architecture note — document the Provider error design: domain error fields, source chains, boundary code/details projection, issue aggregation, and future shared abstractions
- [ ] Observability kickoff — start with structured log context reuse after the context model is stable, keeping trace/correlation identifiers in observability rather than current error details
- [ ] Command boundary fallback logging — include command-layer context usage in the context propagation design, so Tauri command boundaries can log fallback failures without reinterpreting core business errors
- [ ] Lifecycle trigger context integration — decide whether `ProviderCheckTrigger` should remain a standalone lifecycle value object or become part of the provider lifecycle context carried by Context Propagation
- [ ] Lifecycle snapshot context integration — decide whether `ProviderCheckSnapshot` should remain a standalone classified config snapshot or be folded into a provider lifecycle context model after Context Propagation is designed
- [ ] Context-aware downgrade logging — revisit `Downgrade` after Context Propagation / Observability design so downgraded domain errors log structured context instead of only stringified warnings

## Completed

- [x] Provider manager/store/connection services review — tightened short-lived
  variable naming, removed the stale provider-record clone TODO via owned
  `HashMap::remove`, and recorded follow-up persistence / HTTP-client boundary
  cleanup items in `ROADMAP.md`
- [x] Provider models review — tightened model/contract state representations, completed error field documentation, and confirmed common/config/connection/contract/lifecycle/secret model boundaries
- [x] Bot constants/interfaces review — cleaned the unused health-check timeout placeholder and confirmed the provider driver interface boundary, visibility, and service-backed implementation path
- [x] Backend module organization note — documented Rust runtime command/core module organization and left Go sidecar modules as a scoped architecture placeholder
- [x] Reliability architecture scaffold — reorganized `ARCHITECTURE.md` around system architecture and reliability architecture, with context propagation as the foundation for error architecture, observability, and testing strategy
- [x] Backend periphery review — cleaned `Cargo.toml` (cargo sort, description), annotated `build.rs` TODOs for standardization / capabilities / tauri config, confirmed caps and tauri.conf roles
- [x] Provider context checkpoint — decided that context is a reliability-level foundation rather than an error-only detail beyond `provider_id`
- [x] Lifecycle error field pass — classified lifecycle emit/concurrent `ProviderError` variants into typed context fields and real source causes where available
  - [x] `CheckStartedEmit` / `CheckCompletedEmit` / `CheckFailedEmit` — upgraded from `String` to `{ #[source] source: TauriError }`
  - [x] `CheckStatusEmit` — upgraded to `{ provider_id, #[source] source: TauriError }`, with provider context projected through details rather than duplicated in the source-backed Display text
  - [x] `CheckTaskJoin` — split true join failures into `{ #[source] source: JoinError }`
  - [x] `CheckAggregate` — added a lifecycle primary error for collected provider-level errors
- [x] Provider issue aggregation — removed backend `ProviderIssue`/failed-payload `issues`, collected provider-level errors as internal `ProviderError`s, and projected them through `details.suppressedErrors`
- [x] Error detail field consolidation — folded reset recovery failures into `details.suppressedErrors`, removed `with_recovery_failure` constructor
- [x] Serialize cleanup — removed vestigial `impl Serialize for ProviderError` and `#[derive(Serialize)]` from `HealthCheckResult`, both superseded by `ProviderAppError` boundary projection
- [x] Cargo.toml cleanup — removed grouping comments, `cargo sort` alphabetized, `description` updated to "Virganol desktop backend"
- [x] Backend TODO audit — marked 14 non-Provider files (`standardize` / `demolish`), reorganized `core/mod.rs` to separate sidecar infra from provider domain
- [x] Architecture doc scaffold — added Reliability Architecture section with Context / Error / Observability / Testing stubs
- [x] Source binding style unified — `Err(source)` + field shorthand `source,` across connection (`deepseek`, `ollama`) and secret store (`load`) files
- [x] Health-check network/response-format source chain — upgraded DeepSeek/Ollama request and JSON parse failures to carry `provider_id` plus `reqwest::Error` source
- [x] `HealthCheckHttp` typed provider context — replaced free-text HTTP status failures with `provider_id` context in `ProviderError`, keeping status details in driver logs until the broader context model is designed
- [x] `ProviderAppError::from` connect adoption — moved connect manager/store failure responses off the transitional `with_provider_id` helper now that provider context projects from `ProviderError`
- [x] Source-chain checkpoint — CRUD, connection, config store, and secret store failures now preserve real source causes where available; remaining error-system work is lifecycle field modeling, issue aggregation, and context design
- [x] `HealthCheckMissingConfig` typed provider context — replaced free-text missing API key / URL errors with `provider_id`, allowing connect health-check validation failures to project provider context from `ProviderError`
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
- [x] Reset recovery failure modeling — kept recovery failures behind a semantic `with_recovery_failure` app-layer constructor
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
