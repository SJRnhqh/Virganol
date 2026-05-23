# Virganol Contributing Guide

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

## Local Validation

Commit messages are validated by commitlint via husky hooks. Note that some IDEs may bypass hooks, so manual validation may be needed.

CI workflow is defined in `.github/workflows/ci.yml`.

Run CI checks locally from the repository root:

```bash
bash .github/ci/ui-lint.sh
bash .github/ci/go-test.sh
bash .github/ci/rust-check.sh
```
