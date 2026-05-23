# Virganol 🧪

> A local-first, AI-native scientific workbench for connected labs.

Scientific workflows are implemented around an agent-native runtime that
integrates instruments, data, scripts, compute, and models on the desktop.

## Tech Stack

**Languages:** TypeScript · Rust · Go

**Frameworks:** React · Tauri · Eino

## Documentation

- **[ARCHITECTURE](docs/ARCHITECTURE.md)** - System architecture overview
- **[CONTRIBUTING](docs/CONTRIBUTING.md)** - Contribution guidelines
- **[CHANGELOG](docs/CHANGELOG.md)** - Version history and changes
- **[ROADMAP](docs/ROADMAP.md)** - Feature roadmap and milestones
- **[TODO](docs/TODO.md)** - Current branch tasks

## Project Structure

```txt
Virganol/
├── apps/
│   ├── ui/                    # React frontend
│   ├── desktop/               # Tauri desktop wrapper (Rust)
│   └── server/                # Go agent sidecar
├── docs/                      # Documentation
└── prompts/                   # Reusable AI collaboration prompts
```

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

## License

Licensed under the GNU General Public License v3.0. See `LICENSE`.
