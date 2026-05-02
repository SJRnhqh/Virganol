# feat/spirit Branch Tasks

> Current branch task breakdown for Phase 6 error refinement and system closeout

---

## Phase 6.1: Error Refinement (Interactive CRUD Commands)

### 6.1.1: `update_enabled_models` Command Chain

- [ ] Identify missing error codes (persistence failure / validation error)
- [ ] Add unit tests for error scenarios
- [ ] Verify error response contract (code / message / details)

### 6.1.2: `reset_provider` Command Chain

- [ ] Identify missing error codes (provider not found / persistence failure)
- [ ] Add unit tests for error scenarios
- [ ] Verify error response contract

### 6.1.3: `connect_and_save_provider` Command Chain

- [ ] Audit health check error handling
- [ ] Extend `ProviderErrorCode` with health check errors:
  - `NetworkUnreachable` - network connectivity failure
  - `AuthFailure` - authentication/authorization failure
  - `Timeout` - request timeout
  - `InvalidFormat` - response format error
- [ ] Migrate `ProviderError` to `thiserror` (fix `source()` for error chain traceability)
- [ ] Extend `HealthCheckResponse` with `error_code` field
- [ ] Add unit tests for all health check error scenarios
- [ ] Verify error response contract

### 6.1.4: Error System Foundation

- [ ] Migrate static lock to ProviderState.store_lock (replace PROVIDERS_STORE_LOCK)
- [ ] Distinguish system errors (io/serde/keyring) from business errors (network/auth/timeout/format)
- [ ] Define unified error response contract (code / message / details / trace_id)
- [ ] Unify contract serialization to camelCase (`HealthCheckResponse` / `ProviderRecord` / `ProviderStatusPayload`)

### 6.1.5: Connect Keyring Side-Effect Type Refinement

`connect_and_save` falls back to `!normalized_key.is_empty()` in the rollback branch because `Option<ProviderKey>` only encodes the snapshot value, not whether `save_provider_key` actually ran. The two `None` paths (key empty vs. key written but no prior value) cannot be disambiguated by the snapshot alone. Lift "whether keyring was modified" into the type system so rollback becomes type-driven.

**Choose one approach (start after 6.1.4 to avoid entangling with error contract migration)**:

- [ ] **Option B (conservative)**: introduce `KeyChange { snapshot: Option<String>, new_key: String }`, main flow holds `Option<KeyChange>`; rollback collapses to `if let Some(change) = key_change { ... }`; narrow `rollback_provider_key` to `(provider_id, &KeyChange)`
- [ ] **Option C (RAII)**: introduce `ProviderKeyTransaction` with `begin` / `commit` / auto-rollback on `Drop`, located beside `ProviderKey` in `core/bot/models/provider/key_transaction.rs`; constraints: `Drop` cannot return errors or panic (already aligns with current "compensation failure → log only"); guard must be `Send + 'static` for cross-`.await` safety

**Acceptance**:

- [ ] Rollback branch independent of `!normalized_key.is_empty()`
- [ ] Unit tests cover 3 paths: no write / write with no prior key / write with prior key
- [ ] Evaluate whether `reset` chain can reuse the same transaction model

## Phase 6.2: Error Refinement (Lifecycle Commands)

### 6.2.1: `trigger_provider_startup_check` Chain

- [ ] Review existing error handling completeness
- [ ] Refine error codes if needed
- [ ] Add unit tests for edge cases

### 6.2.2: `trigger_provider_manual_refresh` Chain

- [ ] Review existing error handling completeness
- [ ] Refine error codes if needed
- [ ] Add unit tests for edge cases

## Phase 6.3: Frontend Error System

- [ ] Sync frontend error types (mirror backend `ProviderErrorCode`)
- [ ] Adapt frontend for fine-grained error display (per error code UI feedback)
- [ ] Design error display components (Toast / inline error messages)

## Phase 6.4: Logging System (After Error Refinement Complete)

**Backend Logging**:

- [ ] Design log persistence strategy (file rotation / structured format)
- [ ] Define logging points (CRUD entry/exit, health check, persistence operations, error paths)
- [ ] Standardize logging format (level / timestamp / module / message / context)
- [ ] Add structured logging context (trace_id / operation_id / provider_id / error_code)
- [ ] Implement log level strategy (info for success, warn for retryable, error for fatal)

**Frontend Logging**:

- [ ] Design frontend error boundary and middleware
- [ ] Implement frontend logging strategy (console for dev, reporting for prod)
- [ ] Optimize CRUD operation logging (only log slow operations exceeding threshold)

**Observability**:

- [ ] Design trace_id generation and propagation (backend → frontend)
- [ ] Plan log collection and monitoring integration points

## Phase 6.5: Integration Testing & Validation

- [ ] Write integration tests for all 5 command chains
- [ ] End-to-end error propagation validation
- [ ] Error response contract validation
- [ ] Log output validation (if Phase 6.4 complete)
