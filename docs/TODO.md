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

- [ ] Migrate lifecycle-related functions to `core/bot/` domain
- [ ] Verify lifecycle chain integration with refactored structure
- [ ] Update imports and module visibility

### 2. Connect Chain Audit

Audit all functions called by `connect_and_save`:

**Key Management** (`key.rs`)

- [ ] `load_provider_key`
- [ ] `load_provider_key_from_env`
- [ ] `save_provider_key`
- [ ] `remove_provider_key`

**Health Check** (`connection/health.rs`)

- [ ] `health_check` → registry → driver implementations

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

- All provider CRUD backend code migrated to bot domain
- Connect chain fully audited with documented findings
- Reset and update_models chains refactored and verified
- Module structure aligned with domain-driven design principles
