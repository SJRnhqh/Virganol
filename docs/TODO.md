# TODO

## Scope

- Branch: `feat/spirit-lifecycle-error-closeout`
- Goal: close out backend lifecycle error propagation review for provider health checks.
- Non-goals: frontend error system changes, broader provider error contract upgrades, and logging system design.

## Current

- [ ] Audit `emit_provider_status` event emission failure handling.

## Next

- [ ] Review Step 5 structural failure promotion into lifecycle failed events.
- [ ] Review Step 6 lifecycle completed event emission and fallback failure path.
- [ ] Close out lifecycle backend error propagation review notes.

## Validation

- [x] Run `cargo check` from the repository root after lifecycle Rust changes.
- [ ] Confirm lifecycle error propagation notes stay aligned with `docs/ROADMAP.md`.

## Completed

- [x] Pass `ProviderRecord` ownership through lifecycle reconciliation persistence.
- [x] Audit `reconcile_enabled_models` behavior and naming.
- [x] Extract pruned enabled-model reconciliation into `ProviderRecord`.
- [x] Rename lifecycle reconciliation persistence and status record fields.
- [x] Model single-provider check post-processing with `ProviderCheckFinalization`.
- [x] Rename `process_provider_check_result` to `finalize_provider_check_result`.
- [x] Keep Step 4 `runner.rs` `Some(Ok(...))` branch wired through finalization.
