# Branch TODO

- Branch: feat/spirit-log-backend
- Goal: Complete the Rust/Tauri Provider observability v1 with native structured events, correlated execution spans, and durable local logs
- Scope: Rust/Tauri backend logging and tracing; excludes forwarded Go sidecar output, frontend observability, metrics, remote export, and alerting

## Current

- [ ] Document the Rust/Tauri backend observability contract (facade, events, spans, subscriber, layers, sinks, filtering, field stability, lifecycle boundaries), recording the console-only banner, unified default level, and dropped JSONL run delimiter decisions, and update the matching ROADMAP 6.2 progress to close the phase

## Planned

## Completed

- [x] Derived the Provider check trigger token through strum Display alongside serde snake_case, removing the handwritten as_tag match and its dual-source spelling risk
- [x] Codified the relative path discipline, re-export visibility boundaries, and token display derivation policies in rust-code-style.md
- [x] Moved the JSONL persistence verification out of the Rust backend observability gate in ROADMAP 6.2, recording the frontend-aligned deferral decision and the token Display review closeout
- [x] Derived the Provider token Displays through strum across the stage, manager-operation, operation, occurrence, and subject enums, mixing snake_case, transparent, and to_string captures, and removing every handwritten token match arm while keeping Attribution (struct) and ProviderId (single token source) as the closed manual exceptions
- [x] Tightened the banner fallback level rendering to ascii lowercase
- [x] Deferred the ProviderSpan preamble dedup by explicit decision, keeping the explicit per-span field tables as the field-stability contract
- [x] Centralized the default EnvFilter construction in a shared filter helper, keeping per-layer filter instances independently composed
- [x] Centralized manager failure handling in a shared `fail` helper, pairing failure logging with boundary projection at one definition point while keeping the compound suppressed-error arm explicit
- [x] Sunk log severity into a typed observation vocabulary: strum-derived tokens with exhaustive severity on `ProviderObservation`, a `Failure | Observation` bridge occurrence, and a level-blind `ProviderLogEntry`, removing the level argument from every business recorder
- [x] Deduplicated the lifecycle completion tail into one shared helper behind an explicit empty-providers short-circuit, replacing the behavior-equivalent slice match
- [x] Codified the five-tier trait impl order in `rust-code-style.md` as Type Implementation Order (Policy TBD) and realigned `attribution.rs` to the unified convention
- [x] Emitted the console-only startup banner: a double-layer 3D frame with green ANSI Shadow brand art and tiered ❯/· facts for version, log directory, and effective level, validated by a version-matched replica harness with per-row width checks
- [x] Scoped the startup banner to console-only output, replacing the planned stable tracing event and dropping the JSONL run delimiter by explicit decision
- [x] Centralized the default log level as one typed constant shared by the console layer, the JSONL layer, and the banner
- [x] Moved the brand art constant into the logging constants module for single-file maintenance
- [x] Extended the comment ASCII whitelist with the RUST_LOG and ANSI standard terms

- [x] Verified the observability backend through a full review pass, confirming stable layering, naming, and code organization ready for the startup banner
- [x] Merged the run-id generator's split std imports into the nested shared-root import form
- [x] Verified console filtering and readability through a live RUST_LOG downgrade run, accepting duplicated span attribution fields as the compact v1 presentation
- [x] Centralized the rolled JSONL file naming constants shared by the file layer and retention cleanup
- [x] Added first-failure stderr reporting for JSONL writes by wrapping the file appender, keeping later failures silent and errors transparent
- [x] Added startup cleanup of expired daily JSONL log files with a fourteen-day retention window, matching only rolled log naming
- [x] Added non-blocking JSONL file writing with the worker guard owned by managed Tauri state, flushing pending lines on app exit
- [x] Recorded per-span close timing (`time.busy` / `time.idle`) on the JSONL layer through native span close events, keeping console output free of span records
- [x] Emitted stable lifecycle start and completion events to delimit each run in console and JSONL output
- [x] Recorded one stable lifecycle completion event after the completed event is emitted successfully
- [x] Instrumented each Provider lifecycle run with an attributed root span and each concurrent health check with an execution child span, preserving run_id and trigger across task boundaries
- [x] Emitted the enabled-model update success from the surviving manager root with the config-store stage derived as an unconsumed view
- [x] Emitted the connection success from the surviving manager root with scoped connection, config-store, and secret-store stage views
- [x] Emitted the reset success from the surviving manager root with scoped config-store and secret-store stage views
- [x] Recorded successful Provider configuration restoration after a failed reset key deletion
- [x] Recorded successful Provider key rollback after failed connection configuration persistence
- [x] Recorded single Provider reset failures through the singular failure recorder
- [x] Instrumented the Provider connect manager with an attributed async root span, a connection-probe child span, and a successful connection event
- [x] Instrumented the Provider reset manager with an attributed root span and a successful reset event
- [x] Instrumented the Provider enabled-model update manager with an attributed root span and a successful update event
- [x] Established the Provider Span factory with shared attribution fields, lifecycle correlation fields, and stable names for management, lifecycle, and execution business spans
- [x] Simplified Provider scope derivation to use stable stage and operation tokens instead of a duplicated constant matrix
- [x] Established stable native Provider event fields and connected the semantic AppLogger facade directly to tracing
- [x] Assigned timestamps and formatting to subscribers and sinks instead of domain log entries
- [x] Registered tracing-subscriber at the start of Tauri setup with an independently composed, RUST_LOG-filtered console Layer
- [x] Added a daily rolling JSONL Layer in the Tauri application log directory and validated file creation through pnpm dev
- [x] Standardized the desktop application identifier and Provider keyring namespace on com.virganol
- [x] Adopted the compact console format with hidden targets, framework level colors, and local short timestamps via ChronoLocal
- [x] Colored console field keys cyan through a dedicated logging color module, rendering all fields as the v1 field policy
