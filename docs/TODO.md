# TODO

## Scope

- Branch: `feat/spirit-lifecycle-error-closeout`
- Goal: close out backend lifecycle error propagation review for provider health checks.
- Non-goals: frontend error system changes, broader provider error contract upgrades, and logging system design.

## Current

- [ ] Audit `reconcile_enabled_models` behavior and naming.

## Next

- [ ] Decide whether `final_record` should be renamed after reconciliation review.
- [ ] Audit `emit_provider_status` event emission failure handling.
- [ ] Review Step 5 structural failure promotion into lifecycle failed events.
- [ ] Review Step 6 lifecycle completed event emission and fallback failure path.
- [ ] Close out lifecycle backend error propagation review notes.

## Validation

- [ ] Run `cargo check` from the repository root after lifecycle Rust changes.
- [ ] Confirm lifecycle error propagation notes stay aligned with `docs/ROADMAP.md`.

## Completed

- [x] Model single-provider check post-processing with `ProviderCheckFinalization`.
- [x] Rename `process_provider_check_result` to `finalize_provider_check_result`.
- [x] Keep Step 4 `runner.rs` `Some(Ok(...))` branch wired through finalization.
