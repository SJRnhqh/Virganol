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

- [ ] Continue lifecycle backend inspection after commands layer review, focusing on lifecycle checks and error propagation points
