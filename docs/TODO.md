# Branch TODO

- Branch: `feat/spirit-error-and-log`
- Goal: Finish the remaining backend development work for error refinement and
  project logging management after the GitHub/prompt workflow automation work
  has been completed.

## Current

- [ ] Implement the concrete `ProviderError` coarsening in
  `From<&ProviderError> for ProviderErrorCode`, starting with the update-chain
  mapping (`provider_not_found`, `storage_failed`) and extending to reset/connect
  codes as those chains are reviewed.
- [ ] Design the remaining non-`ProviderError` interactive failures: connect
  health-check result errors and reset rollback double-failure errors.

## Planned

- [ ] Keep `ProviderErrorDetails` as a placeholder for now and exclude
  structured details from the current provider error design pass.
- [ ] Treat `ProviderErrorKind` as legacy lifecycle/event-channel classification
  during this pass and avoid using it as the center of the new boundary error
  model; optionally detach `ProviderError::kind()` in favor of
  `ProviderErrorKind::from(&error)` before the 6.1 unified contract upgrade.
- [ ] Replace the remaining connect health-check string failure with a
  `ProviderAppError` once the connection failure code/message contract is
  agreed.
- [ ] Replace the reset rollback double-failure string with a dedicated
  `ProviderAppError` once the rollback failure code/message contract is agreed.
- [ ] Upgrade `ProviderError` after the architecture is agreed: move from the
  current coarse unified model toward a typed, traceable, serializable provider
  error model.
- [ ] Define the project-level logging management model: clarify log ownership,
  levels, structure, persistence, rotation, context fields, and frontend/backend
  responsibilities before implementation.
- [ ] Implement logging changes only after the logging model is settled.

## Completed

- [x] Created the branch-level TODO around the three agreed workstreams: backend
  error management, logging management, and GitHub/prompt workflow scripting.
- [x] Simplified the branch TODO shape to branch, goal, current, planned, and
  completed sections.
- [x] Started prompt workflow cleanup by removing the unused design session
  prompt, renaming the session initializer, adding a prompt template, and
  aligning `AGENTS.md` wording with the prompt playbook model.
- [x] Moved prompt and pipeline assets under `dev/`, with shared workflow
  templates managed by `dev/templates/`.
- [x] Moved root development scripts under `dev/scripts/` and updated package
  commands to use the new paths.
- [x] Refreshed README structure and development overview to reflect `dev/`
  workflow assets and current toolchain badges.
- [x] Locked the Rust toolchain to `1.96.0` and verified it with `cargo check`
  and `pnpm lint:rust:source-headers`.
- [x] Upgraded the pinned pnpm toolchain version to `11.4.0` and verified the
  package workflow after lockfile migration.
- [x] Added the pipeline template for scenario-based workflow orchestration
  under `dev/templates/`.
- [x] Added the session bootstrap pipeline to invoke `dev/prompts/init.md` for
  session startup or context realignment.
- [x] Normalized commit preparation by templating the TODO update and commit
  message prompts and renaming the checkpoint pipeline to `commit-prep`.
- [x] Added the commit pipeline and git commit prompt for explicit commit
  workflows after a commit message has been prepared.
- [x] Aligned the CI pnpm setup action with the pinned `pnpm@11.4.0`
  toolchain after the dependency install check failed in GitHub Actions.
- [x] Migrated the pnpm build-script approval config to the pnpm 11
  `allowBuilds` format so CI can approve `esbuild` during dependency install.
- [x] Added the closeout preparation pipeline by composing `todo-closeout` with
  the shared commit message prompt.
- [x] Normalized PR preparation by templating the PR information prompt and
  adding the `pr-prep` pipeline.
- [x] Added the push pipeline and git push prompt for publishing current branch
  commits without opening a PR.
- [x] Added the PR pipeline by composing current-branch push with the GitHub PR
  creation prompt.
- [x] Removed the obsolete working branch closeout prompt and pipeline after
  replacing them with granular closeout, push, PR preparation, and PR flows.
- [x] Completed the GitHub/prompt workflow automation track by moving workflow
  assets under `dev/`, adding reusable pipeline and prompt templates, and
  documenting the orchestration model in `AGENTS.md`.
- [x] Established the initial provider boundary error skeleton by adding the
  shared `AppError<C, D>` envelope, provider-specific `ProviderAppError`,
  `ProviderErrorCode`, and `ProviderErrorDetails` placeholders, and renaming the
  old variant-aligned `ProviderErrorCode` to `ProviderErrorKind`.
- [x] Promoted the interactive provider command response error slot from
  `Option<String>` to `Option<ProviderAppError>` and aligned the connect, reset,
  and update response failure constructors with the typed boundary error.
- [x] Converted `ProviderAppError` from a type alias into a transparent
  provider-domain newtype over `AppError<ProviderErrorCode, ProviderErrorDetails>`.
- [x] Added the first provider boundary error code,
  `missing_request_data`, with its safe fallback message managed alongside the
  code and exposed through `ProviderAppError::missing_request_data`.
- [x] Replaced the interactive manager missing-data failure sites in `connect`
  and `update_models` with `ProviderAppError::missing_request_data`.
- [x] Renamed the internal provider error file from `base.rs` to `internal.rs`
  and tightened `ProviderError` visibility to the `core::bot` boundary.
- [x] Added the `ProviderError::into_app_error` conversion hook as the explicit
  internal-error to app-boundary error transition point, with concrete mapping
  left for the next implementation pass.
- [x] Migrated single-`ProviderError` interactive manager failure sites in
  `update_models`, `connect`, and `reset` to call `into_app_error` instead of
  passing raw error messages into responses.
- [x] Relocated internal-to-app boundary translation to the contract side by
  adding `From<ProviderError> for ProviderAppError` in `app.rs` and removing
  `ProviderError::into_app_error`, so domain errors no longer depend on boundary
  types.
- [x] Updated interactive manager failure sites to translate domain errors with
  `ProviderAppError::from(e)` at the boundary layer.
- [x] Added update-chain boundary codes `provider_not_found` and `storage_failed`
  with safe fallback messages managed alongside `ProviderErrorCode`.
- [x] Added `From<&ProviderError> for ProviderErrorCode` as the contract-side
  coarsening hook and wired `app.rs` translation to delegate classification to
  the code layer.
