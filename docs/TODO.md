# Branch TODO

- Branch: feat/spirit-log-backend
- Goal: Complete the Rust/Tauri Provider observability v1 with native structured events, correlated execution spans, and durable local logs
- Scope: Rust/Tauri backend logging and tracing; excludes forwarded Go sidecar output, frontend observability, metrics, remote export, and alerting

## Current

- [ ] Define the operational questions and sensitive-field allowlist for Provider observability

## Planned

### Tracing

- [ ] Define Provider lifecycle span boundaries and correlation semantics for run_id and trigger
- [ ] Instrument Provider lifecycle and operations with spans and propagate run_id across Rust async task boundaries
- [ ] Add high-value Provider lifecycle and manager events at stable log levels

### JSONL persistence

- [ ] Define the application log location, rotation, retention, cleanup, and sink-failure fallback behavior
- [ ] Add non-blocking file writing with explicit worker-guard ownership, flush, and orderly shutdown semantics
- [ ] Verify JSONL field stability, persistence, rotation, retention, shutdown, sink failure, and secret redaction across success and failure paths

### Console output

- [ ] Define a compact human-readable console format with deliberate color, target visibility, and field selection
- [ ] Verify console filtering and readability independently from the complete JSONL representation

### Observability contract

- [ ] Normalize remaining direct Rust output through tracing without coupling this branch to forwarded Go sidecar output
- [ ] Document the Rust/Tauri backend observability contract, completion boundary, and deferred Go sidecar integration
- [ ] Update the matching ROADMAP 6.2 progress when the backend observability contract is complete

## Completed

- [x] Established stable native Provider event fields and connected the semantic AppLogger facade directly to tracing
- [x] Assigned timestamps and formatting to subscribers and sinks instead of domain log entries
- [x] Registered tracing-subscriber at the start of Tauri setup with an independently composed, RUST_LOG-filtered console Layer
- [x] Added a daily rolling JSONL Layer in the Tauri application log directory and validated file creation through pnpm dev
- [x] Standardized the desktop application identifier and Provider keyring namespace on com.virganol
