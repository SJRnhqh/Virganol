# Virganol Development Guidelines

Virganol is a local-first, AI-native scientific workbench for connected labs,
built with a React frontend, a Tauri/Rust desktop runtime, and a Go sidecar.

This document defines Virganol's stable project-level development guidance.
Feature-specific architecture, roadmap details, and branch task execution
details should be maintained under `docs/`, not in this file.

## Project Structure

```txt
Virganol/
├── apps/
│   ├── ui/        # Frontend application
│   ├── desktop/   # Desktop runtime
│   └── server/    # Sidecar service
├── docs/          # Project documentation
└── README.md
```

## Documentation Responsibilities

```txt
docs/
├── ARCHITECTURE.md  # System-level architecture overview
├── CONTRIBUTING.md  # Project-level contribution guide
├── CHANGELOG.md     # Version-level change history
├── ROADMAP.md       # Version-level roadmap and progress
├── templates/        # Reference templates for recurring docs
└── TODO.md          # Branch-level task breakdown
```

Use `docs/templates/branch-todo.md` as the reference structure when creating
or refreshing branch-level `docs/TODO.md` files.

## Prompt Responsibilities

Reusable AI collaboration prompts should live under `prompts/`. Stable project
rules belong in `AGENTS.md`, while project state and planning documents belong
under `docs/`.

When the user asks for a "message" after discussing or making code or
documentation changes, interpret it as a commit message request. Read
`prompts/commit-message.md` and follow it.

## Development Workflow

The workflow is defined from coarse to fine: version development, feature
development, and branch development. Releases are promoted from completed
publishable development versions, but not every development version becomes a
release. A version may contain one or more features, and a feature may span one
or more working branches. Working branches merge into the corresponding feature
branch first, feature branches merge into the active `version` branch, and the
`version` branch merges into `dev` only after version-level verification is
complete.

```txt
development version
├── version integration
│   ├── feature development (repeat per feature as needed)
│   │   ├── branch development
│   │   │   └── commits → PR → merge into feature branch
│   │   ├── feature verification and completion
│   │   └── merge feature branch into version branch
│   ├── version verification, docs, and closeout
│   └── merge version branch into dev
└── release promotion (when publishable: dev → main)
```

### Version Development Lifecycle

- A development version should start from `dev` and use a dedicated `version`
  management branch.
- Each development version should be defined by `ROADMAP.md`, including scope,
  planned features, progress, and next steps.
- A development version may contain one or more `feat/*` branches, each of
  which should complete its own feature lifecycle before merging back into the
  active `version` branch.
- A development version is complete only after its planned feature work,
  version-level validation, and relevant documentation updates, including
  `ROADMAP.md` and `CHANGELOG.md`, are finished.
- A completed `version` branch should merge back into `dev`.

### Feature Development Lifecycle

- A feature should start from the active `version` branch and use a dedicated
  `feat/*` integration branch.
- Each feature should follow the scoped intent defined by the active
  `ROADMAP.md`.
- A feature may use one or more working branches as needed, but branch-level
  execution details belong to the branch lifecycle.
- A feature is complete only after its scoped implementation, end-to-end
  validation, test coverage, and relevant updates are finished.
- A completed `feat/*` branch should merge back into the active `version`
  branch through PR.

### Working Branch Development Lifecycle

- A working branch should start from the active `feat/*` branch and stay
  narrowly scoped to one task or one coherent change set.
- Working branches may use names such as `feat/<feature>-<task>`, depending on the change
  type.
- `TODO.md` should track the active branch-level tasks while the working branch
  is in progress.
- A working branch is complete only after its scoped implementation,
  validation, and necessary updates are finished.
- A completed working branch should merge back into the corresponding `feat/*`
  branch through PR.

### Commit Message Convention

When creating or suggesting commit messages, follow the branch-specific type map
below. See `docs/CONTRIBUTING.md` for the complete commit message rules and
local validation workflow.

**Types by branch**:

- `main`: `🌱 init`, `🚀 release`
- `dev`: `📦 version`
- `version`: `🎉 epic`, `⚗️ verify`, `📜 closeout`
- `feat/*`: `📝 docs`, `✨ feat`, `🎨 style`, `🔧 fix`, `🔨 refactor`, `🧹 chore`, `🧪 test`

**Example**: `🌱 init: seedling of Virganol planted`

### Release Lifecycle

- A release should begin only from a completed and publishable state in `dev`.
- Each release should be documented by the relevant `CHANGELOG.md`,
  validation results, and release notes before promotion.
- A release is complete only after the approved state is merged from `dev`
  into `main`.
- `main` should reflect release history only, while `dev` remains the rolling
  development line after release.
