# TODO: feat/spirit-connect-checkout

> Branch-level task breakdown for provider connect chain refactoring and audit

## Scope

Complete backend refactoring and audit for LLM provider CRUD operations, focusing on:

1. Lifecycle chain migration to bot domain
2. Connect chain full audit
3. Reset and update_models chain migration

---

## Tasks

### 1. Lifecycle Chain Migration

- [x] Migrate lifecycle-related functions to `core/bot/` domain
  - Moved from `core/settings/bot/providers/lifecycle/` to `core/bot/services/settings/provider/lifecycle/`
  - All 8 modules migrated: flow, processor, runner, resolver, events, failure, rid, mod
- [x] Verify lifecycle chain integration with refactored structure
  - Commands layer updated to use new import paths
  - Compilation verified successfully
- [x] Update imports and module visibility
  - Established strict visibility hierarchy:
    - `pub(crate)`: `check_providers_lifecycle` (single public interface)
    - `pub(self)`: internal module functions
    - `pub(super)`: parent-only access
  - All old import paths removed

### 2. Connect Chain Audit

Audit all functions called by `connect_and_save`:

**Manager Layer** (`manager/connect.rs`)

- [x] `connect_and_save` main flow audit
  - Refactored to early return pattern for improved readability
  - Verified key rollback logic correctness (env/keyring priority semantics)
  - Confirmed business logic integrity across all edge cases
  - Changed first connection behavior: empty enabled_models list (requires explicit user selection)

**Business Logic** (`helpers/provider/intersection.rs`)

- [x] `compute_enabled_models`
  - Verified intersection logic correctness (preserves user preferences)
  - Confirmed HashSet optimization for O(1) lookup performance
  - Added comprehensive documentation (English + Chinese, with examples)
  - Implementation is optimal and follows Rust community best practices
  - Refactored from `services/settings/provider/selection.rs` to `helpers/provider/intersection.rs`
  - Established `helpers` module for domain-specific utility functions
  - Applied `pub(crate)` visibility for simplicity (Rust community best practice)

**Key Management** (`key/`)

**Refactoring Complete**:

- [x] Migrate to `services/settings/provider/key/` module structure
- [x] Establish strict visibility hierarchy (`pub(super)` → `pub(self)`)
- [x] Add `ProviderError::Keyring` variant for unified error handling
- [x] Update `ProviderErrorCode` with `keyring_error` mapping

**Audit Complete**:

- [x] `save_provider_key` - migrated to `key/save.rs`
  - Unified error handling (`Result<(), ProviderError>`)
  - Removed redundant variables (`account`)
  - Error wrapping to `ProviderError::Keyring`
  - Caller simplified in `connect.rs` (direct `e.message()` propagation)
- [x] `remove_provider_key` - migrated to `key/remove.rs`
  - Unified error handling (`Result<(), ProviderError>`)
  - Removed redundant variables (`account`)
  - Error wrapping to `ProviderError::Keyring`
  - Idempotent delete (NoEntry treated as success)
- [x] `load_provider_key` - migrated to `key/load.rs`
  - Functional style refactoring with `inspect_err` + `?`
  - Removed redundant variables (`account`)
  - Extracted `normalize_and_wrap_key` helper (DRY principle)
  - Zero-copy optimization preserved (trim + zeroize)
  - Graceful error handling (warn logs + None fallback)
- [x] `load_provider_env` - migrated to `key/load.rs`
  - Refactored from `for` loop to `find_map` functional style
  - Shared `normalize_and_wrap_key` helper with `load_provider_key`
  - Minimized sensitive data lifetime (immediate consumption)
  - Log only on success (empty values silently skipped)

**Key Management audit complete** - all functions reviewed, optimized, and migrated to modular structure.

**Health Check** (`connection/`)

**Refactoring Complete**:

- [x] Migrate to `services/settings/provider/connection/` module
- [x] Establish strict visibility hierarchy (`pub(crate)` → `pub(self)` → `pub(super)` → `private`)
- [x] Extract `ProviderDriver` trait to `core/bot/interfaces`
- [x] Apply principle of least privilege
- [x] Tighten `health_check` visibility to `pub(self)` (provider module internal only)

**Interface Audit Complete**:

- [x] `health_check` function interface verified
  - Signature: `async fn(ProviderId, &str, &str) -> HealthCheckResponse`
  - Called correctly by `manager/connect.rs` and `lifecycle/resolver.rs`
  - Visibility restricted to `pub(self)` (module internal)
  - Error handling consistent with caller expectations

**Implementation audit deferred** (out of scope for CRUD chain refactoring):

- Driver registry mechanism (`get_driver`)
- Provider-specific implementations (`deepseek_check` / `ollama_check`)
- HTTP client error handling details
- See ROADMAP Phase 6+ for health check subsystem optimization

**Persistence** (`persistence.rs`)

- [x] `load_provider_record` - unified strict error handling, code simplification
- [x] `save_provider` - code simplification, return value optimization

Audit completed:

- Unified strict error handling (`Result<_, ProviderError>`)
- Simplified function naming (removed `_strict` suffix)
- Code simplification (removed redundant variables)
- Added performance optimization markers (TODO + ROADMAP)
- Adapted callers (`connect.rs`, `reset.rs`)

Deferred optimizations:

- Error refinement (Phase 5.3)
- Cache optimization (Phase 6.2, trigger conditions not met)

Audit dimensions:

- Location appropriateness (domain/layer alignment)
- Single responsibility
- Error handling consistency (`ProviderError` integration)
- Visibility constraints (`pub(crate)` review)

### 3. CRUD Manager Split

- [x] Split former `crud.rs` into `manager/connect.rs`, `manager/reset.rs`, and `manager/update.rs`
- [x] Add `manager/mod.rs` as the internal CRUD aggregation boundary
- [x] Update provider export chain to re-export CRUD entrypoints via `manager`
- [x] Remove obsolete `crud.rs` and keep external service interface stable

### 4. Code Quality Improvements

- [x] Add `rustfmt.toml` for code formatting standards
  - Configured basic rules: edition=2021, max_width=100, tab_spaces=4
  - Included bilingual documentation (English + Chinese)
  - Documented stable vs unstable features
- [x] Establish helpers module architecture
  - Created `core/bot/helpers/` for domain-specific utility functions
  - Applied consistent `pub(crate)` visibility (simple over clever)
  - Documented module structure and visibility philosophy

---

## Completion Criteria

- [x] All provider CRUD backend code migrated to bot domain
- [x] Connect chain fully audited with documented findings
- [x] Reset and update_models chains refactored and verified
- [x] Module structure aligned with domain-driven design principles

---
