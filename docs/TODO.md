# feat/spirit-health-errors Branch Tasks

> Current branch scope: health check business error review

---

## Completed Warm-up Refactors

- [x] Move `load_provider_record` into `store/config/load.rs`
- [x] Move connect command contracts under `contract/manager`
- [x] Move `ProviderRecord` under provider config models

## Health Check Error Review

- [ ] Audit health check business failure points in provider drivers
- [ ] Classify health check failures by user-facing cause
- [ ] Prepare `HealthCheckResponse` for structured error codes
- [ ] Keep command response generic upgrade out of this branch
