# feat/spirit-health-errors Branch Tasks

> Current branch scope: health check business error review

---

## Completed Warm-up Refactors

- [x] Move `load_provider_record` into `store/config/load.rs`
- [x] Move connect command contracts under `contract/manager`
- [x] Move `ProviderRecord` under provider config models

## Completed Prompt Updates

- [x] Add `prompts/design-session.md` for product, UI, brand, and architecture
  discussion sessions

## Health Check Error Review

- [x] Audit health check business failure points in provider drivers
- [x] Classify health check failures by user-facing cause
- [x] Prepare `HealthCheckResult` for structured error codes
- [x] Keep command response generic upgrade out of this branch
