# Branch TODO

- Branch: feat/spirit-log-backend
- Goal: Complete the Rust/Tauri Provider observability v1 with native structured events, correlated execution spans, and durable local logs
- Scope: Rust/Tauri backend logging and tracing; excludes forwarded Go sidecar output, frontend observability, metrics, remote export, and alerting

## Current

- [ ] Define the operational questions and sensitive-field allowlist for Provider observability

## Planned

### JSONL persistence

- [ ] Define the application log location, rotation, retention, cleanup, and sink-failure fallback behavior
- [ ] Add non-blocking file writing with explicit worker-guard ownership, flush, and orderly shutdown semantics
- [ ] Verify JSONL field stability, active-span correlation (`run_id`, `trigger`, and Provider attribution), persistence, rotation, retention, shutdown, sink failure, and secret redaction across success and failure paths

### Console output

- [ ] Emit a startup banner as a stable tracing event carrying branding, version, and resolved logging facts (log directory, effective log level), sequenced after JSONL persistence maturation so the displayed facts stay stable and the banner doubles as a JSONL run delimiter
- [ ] Verify console filtering and readability independently from the complete JSONL representation

### Observability contract

- [ ] Normalize remaining direct Rust output through tracing without coupling this branch to forwarded Go sidecar output
- [ ] Document the Rust/Tauri backend observability contract, completion boundary, and deferred Go sidecar integration
- [ ] Update the matching ROADMAP 6.2 progress when the backend observability contract is complete

## Completed

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
