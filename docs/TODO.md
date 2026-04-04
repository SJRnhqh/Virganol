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

**Key Management** (`key.rs`)

- [ ] `load_provider_key`
- [ ] `load_provider_key_from_env`
- [ ] `save_provider_key`
- [ ] `remove_provider_key`

**Health Check** (`connection/health.rs`)

**Refactoring Complete**:

- [x] Migrate to `services/settings/provider/connection/` module
- [x] Establish strict visibility hierarchy (`pub(crate)` → `pub(self)` → `pub(super)` → `private`)
- [x] Extract `ProviderDriver` trait to `core/bot/interfaces`
- [x] Apply principle of least privilege

**Audit Pending**:

- [ ] `health_check` function implementation audit
- [ ] `get_driver` registry mechanism audit
- [ ] `deepseek_check` / `ollama_check` implementation audit
- [ ] Error handling consistency audit

**Persistence** (`persistence.rs`)

- [ ] `load_provider_record`
- [ ] `save_provider`

**Business Logic** (`selection.rs`)

- [ ] `compute_enabled_models`

Audit dimensions:

- Location appropriateness (domain/layer alignment)
- Single responsibility
- Error handling consistency (`ProviderError` integration)
- Visibility constraints (`pub(crate)` review)

### 3. Reset & Update Models Chain Migration

- [x] Migrate `reset_provider_config` to `crud.rs`
- [x] Migrate `update_provider_enabled_models` to `crud.rs`
- [x] Update export chain and remove old `service.rs`
- [x] Verify CRUD chain completeness

---

## Completion Criteria

- [x] All provider CRUD backend code migrated to bot domain
- [x] Connect chain fully audited with documented findings
- [x] Reset and update_models chains refactored and verified
- [x] Module structure aligned with domain-driven design principles

---
