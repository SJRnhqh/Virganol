# Branch TODO

- Branch: feat/spirit-log-backend
- Goal: Complete the Rust/Tauri Provider observability v1 with native structured events, correlated execution spans, and durable local logs
- Scope: Backend logging and tracing from Rust/Tauri plus forwarded sidecar output; excludes frontend observability, metrics, remote export, and alerting

## Current

- [ ] Define the operational questions and sensitive-field allowlist for Provider observability

## Planned

- [ ] Define Provider lifecycle span boundaries and correlation semantics for run_id and trigger
- [ ] Instrument Provider lifecycle and operations with spans and propagate run_id across Rust async task boundaries
- [ ] Add high-value Provider lifecycle and manager events at stable log levels
- [ ] Compose console and rolling local-file Layers under one subscriber with independent filters and structured persistent output
- [ ] Define the application log location, rotation, retention, cleanup, and sink-failure fallback behavior
- [ ] Add non-blocking file writing with explicit worker-guard ownership, flush, and orderly shutdown semantics
- [ ] Route direct Rust output and forwarded Go sidecar stdout and stderr through normalized tracing events with source targets
- [ ] Verify field stability, filtering, correlation, persistence, rotation, shutdown, and secret redaction across success and failure paths
- [ ] Document the backend observability contract and update the matching ROADMAP 6.2 progress

## Completed

- [x] Standardized the desktop application identifier and Provider keyring namespace on com.virganol
- [x] Refactored the logging backend into a subscriber registration module and an independently composed console Layer without changing console behavior
- [x] Tokenized attribution stage, subject, and operation field values and removed the dead shared attribution Display
- [x] Added the first high-value Provider lifecycle event at Info level using the stable native event fields
- [x] Defined occurrence and flattened attribution stage, subject, and operation as stable native Event fields
- [x] Connected AppLogger directly to tracing with occurrence and attribution as native Event fields
- [x] Assigned record timestamps to subscriber and sink formatting and removed the redundant LogEntry timestamp
- [x] Backend selection settled on tracing-subscriber sharing one pipeline between logs and future tracing
- [x] Replaced env_logger with a tracing-subscriber stderr sink without facade or call-site changes
- [x] Preserved RUST_LOG filtering with an Info default and validated the console backend through pnpm dev
- [x] Scoped this branch to terminal output while leaving persistence and non-terminal sink formats open
