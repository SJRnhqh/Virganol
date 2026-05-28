# feat/spirit-lifecycle-error Branch Tasks

> Current branch scope: lifecycle backend error propagation review

---

## Lifecycle Error Review

### Completed Preparation

- [x] Review provider commands layer boundaries for startup_check and manual_refresh
- [x] Keep startup_check and manual_refresh as separate command entry points with shared lifecycle core
- [x] Reorganize provider lifecycle models from check.rs into models/provider/lifecycle
- [x] Normalize comments for reviewed provider models using the English/Chinese documentation pattern
- [x] Tighten unnecessary Debug, Default, and visibility usage in reviewed provider command models
- [x] Clarify ProviderCommandRequest serde default and generic bound behavior

### Active Review

- [x] Enter services-layer lifecycle review from `flow.rs` after commands-layer review
- [x] Review lifecycle run ID setup in `flow.rs` and keep run ID generation scoped to `lifecycle/rid.rs`
- [x] Normalize comments and local import style for lifecycle flow/run ID review scaffolding
- [x] Normalize comments for small core modules outside large `models` and `services` areas
- [x] Review `flow.rs` Step 1 run ID setup and keep lifecycle run ID ownership in the flow scope
- [x] Review `flow.rs` Step 2 lifecycle started event emission and failure reporting
- [x] Borrow lifecycle started/failed payload run IDs and remove redundant serialize-only serde default
- [ ] Continue `flow.rs` Step 3 review from persisted provider snapshot loading and skipped provider handling
