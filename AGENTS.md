# Repository Guidelines

## Scope

- Applies to AI coding agents (such as Codex) and human contributors.
- Scope: the repository root and all subdirectories.

## Current Phase Scope

- The current phase only focuses on the **Tauri ↔ React** provider lifecycle and secure persistence. Sidecar feature work is out of scope.
- The current scope is limited to **deepseek** and **ollama**.
- Any provider change must keep the lifecycle flow and CRUD flow consistent.

## Documentation Map

- `docs/ARCHITECTURE.md`: system layers, the Landlord-Tenant model, and cross-layer responsibility boundaries.
- `docs/ROADMAP.md`: the medium- and long-term evolution plan for the provider lifecycle, including completed phases and upcoming work.
- `docs/TODO.md`: the current short-term sprint backlog and frontend review order. By default, progress bottom-up as `store → handlers → hooks → components`.
- If fields, events, commands, or state semantics change, update the corresponding documentation in the same change.

## Project Structure

- `apps/ui/`: React + TypeScript frontend, with most core logic under `src/features/`.
- `apps/desktop/`: Tauri + Rust desktop runtime, mainly under `commands/` and `core/`.
- `apps/server/`: Go gRPC sidecar, mainly under `cmd/agent/`, `internal/`, `pkg/service/`, and `proto/`.

## Development And Validation

- `pnpm dev`: start desktop development, including the sidecar.
- `pnpm dev:ui`: start the frontend only.
- `bash .github/ci/ui-lint.sh`: run frontend lint checks.
- `bash .github/ci/go-test.sh`: run Go tests.
- `bash .github/ci/rust-check.sh`: run Rust checks.

## Code And Commit Workflow

- TS/React: use 2-space indentation, `PascalCase` for components, and `useXxx` for hooks.
- Rust/Go: follow the language defaults, including Rust `snake_case` and `gofmt`.
- Recommended commit format: `emoji + type + lowercase English summary` such as `🔧 fix: ...`, without excessive detail.
- Before committing, at minimum pass UI lint, Go tests, and Rust checks.

## Security Requirements

- Never log API keys or tokens.
- Never return plaintext secrets through frontend events or responses. Sensitive data should be handled in the desktop layer whenever possible.
- The frontend must not connect to providers directly. Provider access should go through the desktop layer first.
- Any provider change must verify consistency across `connect`, `retry`, `reset`, and `update_models`.
