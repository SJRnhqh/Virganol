# Health Check Subsystem Audit

> Branch-level task breakdown for provider health check refinement

---

## Scope

Audit and refine the health check subsystem under `services/settings/provider/connection/`, focusing on driver implementation and code quality.

---

## Tasks

### 1. Driver Registry Review

**File**: `apps/desktop/src-tauri/src/core/bot/services/settings/provider/connection/registry.rs`

- [x] Verify `get_driver()` lookup logic
- [x] Confirm registered providers align with frontend whitelist (deepseek/ollama)
- [x] Evaluate `OnceLock<HashMap>` initialization pattern

**Additional files reviewed**:

- [x] `health.rs` - routing logic correct, error fallback in place
- [x] `interfaces/provider/driver.rs` - trait design sound, lifetime annotations correct

### 2. Provider Implementation Audit

**Files**:

- `apps/desktop/src-tauri/src/core/bot/services/settings/provider/connection/deepseek.rs`
- `apps/desktop/src-tauri/src/core/bot/services/settings/provider/connection/ollama.rs`

**Ollama**:

- [x] HTTP client error handling (network/timeout/auth distinction)
- [x] Response parsing robustness (empty models, malformed JSON)
- [x] Evaluate per-call `Client::new()` vs shared connection pool
- [x] Timeout configuration (current: 5s hardcoded)

**Deepseek**:

- [x] HTTP client error handling (network/timeout/auth distinction)
- [x] Response parsing robustness (empty models, malformed JSON)
- [x] Evaluate per-call `Client::new()` vs shared connection pool
- [x] Timeout configuration (current: 5s hardcoded)

### 3. Code Quality Improvements

- [x] Remove redundant `trim()` calls (upstream already normalizes input)
- [x] Simplify error messages (remove misleading env var hints)
- [x] Remove unnecessary `trim_end_matches` on constants

---

## Findings & Deferred Optimizations

**Current implementation is sound**. The following optimizations are identified but deferred to later phases:

- **Error granularity** (Phase 5.3): Distinguish network/auth/timeout failures with fine-grained error codes
- **Connection pool** (Phase 6.2): Replace per-call `Client::new()` with `OnceLock<Client>`
- **Timeout configuration** (Phase 6.2): Make 5s timeout configurable
- **Log standardization** (Phase 6.x): Unify log format and levels

---

## Out of Scope

- Error code mapping and `HealthCheckResponse` structure extension (Phase 5.3)
- Frontend error display logic (Phase 5 frontend audit)
- Lifecycle chain integration (Phase 6.3)
- Per-provider locking mechanism (Phase 6.2 optimization)
