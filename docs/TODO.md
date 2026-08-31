# Branch TODO

- Branch: feat/spirit-log-backend
- Goal: Integrate tracing-subscriber as the unified logging backend, replacing env_logger with zero facade or call-site changes

## Current

- [ ] Prepare branch closeout and PR

## Planned

- [ ] Check off the ROADMAP 6.2 backend item at PR stage

## Completed

- [x] Backend selection settled on tracing-subscriber sharing one pipeline between logs and future tracing
- [x] Replaced env_logger with a tracing-subscriber stderr sink without facade or call-site changes
- [x] Preserved RUST_LOG filtering with an Info default and validated the console backend through pnpm dev
- [x] Scoped this branch to terminal output while leaving persistence and non-terminal sink formats open
