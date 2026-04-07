# Health Check Subsystem Audit

> Branch-level task breakdown for provider health check refinement

---

## Scope

Audit and refine the health check subsystem under `services/settings/provider/connection/`, focusing on error granularity, driver implementation, and response structure.

---

## Tasks

### 1. Driver Registry Review

**File**: `apps/desktop/src-tauri/src/core/bot/services/settings/provider/connection/registry.rs`

- [ ] Verify `get_driver()` lookup logic
- [ ] Confirm registered providers align with frontend whitelist (deepseek/ollama)
- [ ] Evaluate `OnceLock<HashMap>` initialization pattern

### 2. Provider Implementation Audit

**Files**:

- `apps/desktop/src-tauri/src/core/bot/services/settings/provider/connection/deepseek.rs`
- `apps/desktop/src-tauri/src/core/bot/services/settings/provider/connection/ollama.rs`

- [ ] HTTP client error handling (network/timeout/auth distinction)
- [ ] Response parsing robustness (empty models, malformed JSON)
- [ ] Evaluate per-call `Client::new()` vs shared connection pool
- [ ] Timeout configuration (current: 5s hardcoded)

### 3. Error Granularity Enhancement

**Context**: ROADMAP Phase 5.3 — distinguish network/auth/timeout failures

- [ ] Define new `ProviderErrorCode` variants for health check failures:
  - Network unreachable
  - Authentication failed (401/403)
  - Timeout
  - Invalid response format
- [ ] Map `reqwest::Error` to fine-grained error codes
- [ ] Update `HealthCheckResponse` to carry `error_code` field

### 4. Response Structure Extension

**File**: `apps/desktop/src-tauri/src/core/bot/models/provider/check.rs`

- [ ] Add `error_code: Option<ProviderErrorCode>` to `HealthCheckResponse`
- [ ] Distinguish system errors (io/serde) from health check failures
- [ ] Update `connect.rs` TODO comments (L74, L122) after structure finalized

### 5. Integration Verification

- [ ] Ensure `health_check()` error codes propagate to `connect_and_save`
- [ ] Verify frontend can consume fine-grained error codes
- [ ] Update error handling in `manager/connect.rs` if needed

---

## Out of Scope

- Frontend error display logic (Phase 5 frontend audit)
- Lifecycle chain integration (Phase 6.3)
- Per-provider locking mechanism (Phase 6.2 optimization)
