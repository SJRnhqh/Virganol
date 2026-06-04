# Branch TODO

## Scope

- Branch: `feat/spirit-error-and-log`
- Goal: Settle and implement the branch-level direction for backend error
  management, project logging management, and GitHub/prompt workflow
  scripting.
- Non-goals: Full frontend error display implementation, release/version
  closeout, unrelated Provider CRUD behavior changes, and broad architecture
  rewrites outside the agreed error/log/workflow scope.

## Current

- [ ] Define the project-level error management model: clarify global error
  boundaries, backend error architecture, and the upgrade path from the coarse
  `ProviderError` model to a finer structured error system.

## Next

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

## Validation

- [ ] Review this TODO against `docs/templates/branch-todo.md` after each
  branch checkpoint.
- [ ] For backend error changes, run `cargo check` from the repository root and
  relevant Rust tests when available.
- [ ] For logging changes, verify structured output manually and run the
  relevant Rust validation command.
- [ ] For GitHub/prompt workflow changes, dry-run the prompt flow on the current
  branch and validate any scripts with non-mutating commands first.

## Completed

- [x] Created the branch-level TODO around the three agreed workstreams: backend
  error management, logging management, and GitHub/prompt workflow scripting.
