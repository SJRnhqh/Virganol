# Virganol 🧪

> A modern AI-native scientific IDE for scientists and engineers.

## Tech Stack

**Languages:** TypeScript · Rust · Go

**Frameworks:** React · Tauri · Eino

## Documentation

- **[Architecture](docs/ARCHITECTURE.md)** - System architecture overview
- **[Roadmap](docs/ROADMAP.md)** - Feature roadmap and milestones
- **[TODO](docs/TODO.md)** - Current sprint tasks and progress tracking

## Project Structure

```txt
Virganol/
├── apps/
│   ├── ui/                    # React frontend
│   ├── desktop/               # Tauri desktop wrapper (Rust)
│   └── server/                # Go agent sidecar
└── docs/                      # Documentation
```

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

## CI

CI workflow is defined in `.github/workflows/ci.yml`.

Run CI checks locally from repository root:

```bash
bash .github/ci/ui-lint.sh
bash .github/ci/go-test.sh
bash .github/ci/rust-check.sh
```

## License

Licensed under the GNU General Public License v3.0. See `LICENSE`.
