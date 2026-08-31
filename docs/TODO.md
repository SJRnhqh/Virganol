# Branch TODO

- Branch: feat/spirit-log-backend
- Goal: Integrate tracing-subscriber as the unified logging backend, replacing env_logger with zero facade or call-site changes

## Current

- [ ] Install tracing-subscriber with a console sink and replace env_logger

## Planned

- [ ] Validate the console backend integration
- [ ] Discuss the sink strategy in roadmap planning, leaving the format open
- [ ] Check off the ROADMAP 6.2 backend item at PR stage

## Completed

- [x] Backend selection settled on tracing-subscriber sharing one pipeline between logs and future tracing
