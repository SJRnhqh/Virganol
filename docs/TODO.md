# Branch TODO

- Branch: `feat/spirit-error-and-log`
- Goal: Finish the remaining backend development work for error refinement and
  project logging management after the GitHub/prompt workflow automation work
  has been completed.

## Current

- [ ] Define the provider boundary error model for the code/message layer:
  clarify the responsibility boundary of `ProviderAppError`, design the stable
  `ProviderErrorCode` taxonomy, and define safe message rules before mapping
  internal `ProviderError` values into boundary errors.

## Planned

- [ ] Keep `ProviderErrorDetails` as a placeholder for now and exclude
  structured details from the current provider error design pass.
- [ ] Treat `ProviderErrorKind` as legacy internal classification during this
  pass and avoid using it as the center of the new boundary error model.
- [ ] Implement the `ProviderAppError` code/message layer after its boundary
  responsibility and `ProviderErrorCode` taxonomy are agreed.
- [ ] Implement the `ProviderError` to `ProviderAppError` conversion only after
  `ProviderAppError` and `ProviderErrorCode` have concrete code/message
  semantics.
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
