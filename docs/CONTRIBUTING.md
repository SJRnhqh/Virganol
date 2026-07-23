# Virganol Contributing Guide

## Contribution Workflow

## Development Standards

### Code Style

Code style rules for each technology stack:

- [Rust Code Style](rules/rust-code-style.md)

## Local Validation

Run the repository validation command before committing. The same checks run
in the pre-commit hook and CI:

```bash
pnpm test
```

## Commit Message Convention

Virganol uses emoji-prefixed commit messages to indicate the type and scope of changes. The format is enforced by commitlint.

### Format

```bash
<emoji> <type>: <subject>

[optional body]

[optional footer]
```

### Rules

- **Header**: Max 100 characters
- **Subject**: Lowercase, no trailing period
- **Body/Footer**: Require blank line separation if present

### Commit Types by Branch

#### `main` Branch

- `🌱 init` - Project initialization
- `🚀 release` - Release marker

#### `dev` Branch

- `📦 version` - Development version update

#### `version` Branch

- `🎉 epic` - Major feature integration (merged from `feat/*`)
- `⚗️ verify` - Version-level verification
- `📜 closeout` - Version documentation closeout (CHANGELOG, ROADMAP)

#### `feat/*` Branch

- `📝 docs` - Documentation changes
- `✨ feat` - New feature
- `🎨 style` - UI/UX styling changes
- `🔧 fix` - Bug fixes
- `🔨 refactor` - Code refactoring
- `🧹 chore` - Maintenance tasks
- `🧪 test` - Test additions or modifications

### Examples

```bash
# Feature branch
🎨 style: refactor reset button UI and extract manager hook
🔧 fix: guard provider reset on success
📝 docs: add roadmap todo for form cleanup

# Version branch
🎉 epic: complete provider configuration CRUD chain
⚗️ verify: validate reset flow across all provider states

# Dev branch
📦 version: bump to v0.2.0-dev

# Main branch
🚀 release: v0.1.0
```

## Pull Request Guidelines
