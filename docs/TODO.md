# feat/spirit-error-management TODO

## Objective

Error refinement and logging system optimization

## Tasks

### Phase 6.1: Contract Semantics & Error Refinement

**Backend Error System**:

- [ ] Define `ProviderErrorCode` enum (network / auth / timeout / format / io / serde)
- [ ] Make `ProviderError` error chain traceable (migrate to `thiserror` for `Display` / `Error` / `From` derivation, fix empty `source()` implementation that prevents `serde_json::Error` details from surfacing)
- [ ] Subdivide health check errors (network unreachable / auth failure / timeout / response format error)
- [ ] Extend `HealthCheckResponse` with `error_code` field
- [ ] Distinguish system errors (io/serde) from business errors

**Contract Layer**:

- [ ] Unify contract serialization naming to camelCase (`HealthCheckResponse` / `ProviderRecord` / `ProviderStatusPayload` with serde rename)
- [ ] Define error response contract (code / message / details / trace_id)

**Frontend Error System**:

- [ ] Sync frontend error types (mirror backend `ProviderErrorCode`)
- [ ] Adapt frontend for fine-grained error display (per error code UI feedback)
- [ ] Design error display components (Toast / inline error messages)

### Phase 6.2: Logging & Middleware Unification

**Backend Logging**:

- [ ] Define logging points (CRUD entry/exit, health check, persistence operations, error paths)
- [ ] Standardize backend logging format (level / timestamp / module / message / context)
- [ ] Add structured logging context (operation_id / provider_id / error_code)
- [ ] Implement log level strategy (info for success, warn for retryable, error for fatal)

**Frontend Logging**:

- [ ] Design frontend error boundary and middleware
- [ ] Implement frontend logging strategy (console for dev, reporting for prod)
- [ ] Optimize frontend CRUD operation logging (only log slow operations exceeding threshold to reduce noise)

**Observability**:

- [ ] Plan log collection and monitoring integration points
- [ ] Design trace_id propagation (backend → frontend)
