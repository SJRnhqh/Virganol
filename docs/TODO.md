# Branch TODO

- Branch: feat/spirit-log-backend
- Goal: Evolve tracing-subscriber into a structured observability backend, starting at the AppLogger boundary

## Current

- [ ] Define the structured event fields and span boundary at the AppLogger seam

## Completed

- [x] Backend selection settled on tracing-subscriber sharing one pipeline between logs and future tracing
- [x] Replaced env_logger with a tracing-subscriber stderr sink without facade or call-site changes
- [x] Preserved RUST_LOG filtering with an Info default and validated the console backend through pnpm dev
- [x] Scoped this branch to terminal output while leaving persistence and non-terminal sink formats open
