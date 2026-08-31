# Branch TODO

- Branch: feat/spirit-log-backend
- Goal: Complete the Rust/Tauri Provider observability v1 with native structured events, correlated execution spans, and durable local logs
- Scope: Backend logging and tracing from Rust/Tauri plus forwarded sidecar output; excludes frontend observability, metrics, remote export, and alerting

## Current

- [ ] Define the operational questions, stable event fields, span boundaries, correlation semantics, and sensitive-field allowlist

## Planned

- [ ] Emit native tracing events from AppLogger without flattening LogEntry into one message field
- [ ] Instrument Provider lifecycle and operations with spans and propagate run_id across Rust async task boundaries
- [ ] Compose console and rolling local-file Layers under one subscriber with independent filters and structured persistent output
- [ ] Define the application log location, rotation, retention, cleanup, and sink-failure fallback behavior
- [ ] Add non-blocking file writing with explicit worker-guard ownership, flush, and orderly shutdown semantics
- [ ] Route direct Rust output and forwarded Go sidecar stdout and stderr through normalized tracing events with source targets
- [ ] Verify field stability, filtering, correlation, persistence, rotation, shutdown, and secret redaction across success and failure paths
- [ ] Document the backend observability contract and update the matching ROADMAP 6.2 progress

## Completed

- [x] Backend selection settled on tracing-subscriber sharing one pipeline between logs and future tracing
- [x] Replaced env_logger with a tracing-subscriber stderr sink without facade or call-site changes
- [x] Preserved RUST_LOG filtering with an Info default and validated the console backend through pnpm dev
- [x] Scoped this branch to terminal output while leaving persistence and non-terminal sink formats open
