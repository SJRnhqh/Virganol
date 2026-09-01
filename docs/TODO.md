# Branch TODO

- Branch: feat/spirit-log-backend
- Goal: Complete the Rust/Tauri Provider observability v1 with native structured events, correlated execution spans, and durable local logs
- Scope: Rust/Tauri backend logging and tracing; excludes forwarded Go sidecar output, frontend observability, metrics, remote export, and alerting

## Current

- [ ] Define Provider lifecycle span boundaries and correlation semantics for run_id and trigger

## Planned

### Tracing

- [ ] Instrument Provider lifecycle and operations with spans and propagate run_id across Rust async task boundaries
- [ ] Add high-value Provider lifecycle and manager events at stable log levels

### JSONL persistence

- [ ] Define the operational questions and sensitive-field allowlist for Provider observability
- [ ] Define the application log location, rotation, retention, cleanup, and sink-failure fallback behavior
- [ ] Add non-blocking file writing with explicit worker-guard ownership, flush, and orderly shutdown semantics
- [ ] Verify JSONL field stability, persistence, rotation, retention, shutdown, sink failure, and secret redaction across success and failure paths

### Console output

- [ ] Emit a structured run-start event to delimit each run in console and JSONL output
- [ ] Verify console filtering and readability independently from the complete JSONL representation

### Observability contract

- [ ] Normalize remaining direct Rust output through tracing without coupling this branch to forwarded Go sidecar output
- [ ] Document the Rust/Tauri backend observability contract, completion boundary, and deferred Go sidecar integration
- [ ] Update the matching ROADMAP 6.2 progress when the backend observability contract is complete

## Completed

- [x] Instrumented the Provider reset manager with an attributed root span and a successful reset event
- [x] Instrumented the Provider enabled-model update manager with an attributed root span and a successful update event
- [x] Established the Provider Span factory with shared attribution fields, lifecycle correlation fields, and a stable subject-reality name
- [x] Simplified Provider scope derivation to use stable stage and operation tokens instead of a duplicated constant matrix
- [x] Established stable native Provider event fields and connected the semantic AppLogger facade directly to tracing
- [x] Assigned timestamps and formatting to subscribers and sinks instead of domain log entries
- [x] Registered tracing-subscriber at the start of Tauri setup with an independently composed, RUST_LOG-filtered console Layer
- [x] Added a daily rolling JSONL Layer in the Tauri application log directory and validated file creation through pnpm dev
- [x] Standardized the desktop application identifier and Provider keyring namespace on com.virganol
- [x] Adopted the compact console format with hidden targets, framework level colors, and local short timestamps via ChronoLocal
- [x] Colored console field keys cyan through a dedicated logging color module, rendering all fields as the v1 field policy
