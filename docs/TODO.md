# Branch TODO

- Branch: `feat/spirit-error-and-log`
- Goal: Settle and implement the branch-level direction for backend error
  management, project logging management, and GitHub/prompt workflow scripting.

## Current

- [ ] Define the project-level error management model: clarify global error
  boundaries, backend error architecture, and the upgrade path from the coarse
  `ProviderError` model to a finer structured error system.

## Planned

- [ ] Design the backend error management architecture before implementation:
  classify system errors vs business errors, define error codes, decide error
  chaining, and align command response contracts.
- [ ] Upgrade `ProviderError` after the architecture is agreed: move from the
  current coarse unified model toward a typed, traceable, serializable provider
  error model.
- [ ] Define the project-level logging management model: clarify log ownership,
  levels, structure, persistence, rotation, context fields, and frontend/backend
  responsibilities before implementation.
- [ ] Implement logging changes only after the logging model is settled.
- [ ] Establish the GitHub scripted workflow and prompt library: standardize
  reusable prompts, branch/PR/CI helper flows, and the order in which prompts
  compose into working pipelines.
- [ ] Refine the overall prompt workflow so branch setup, TODO update, commit
  message generation, PR info, and branch closeout have clear reusable paths.

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
