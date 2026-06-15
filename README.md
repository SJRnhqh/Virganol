# 🌿 Virganol

> A local-first, AI-native scientific workbench for connected labs.

Scientific workflows are implemented around an agent-native runtime that
integrates instruments, data, scripts, compute, and models on the desktop.

## Project Structure

```txt
Virganol/
├── apps/
│   ├── ui/                    # React frontend
│   ├── desktop/               # Tauri desktop wrapper
│   └── server/                # Go sidecar service
├── dev/                       # Developer workflow assets
│   ├── pipelines/             # AI collaboration workflow pipelines
│   ├── prompts/               # Reusable AI collaboration prompts
│   ├── scripts/               # Development maintenance scripts
│   └── templates/             # Developer workflow templates
├── docs/                      # Project documentation and branch state
└── README.md
```

## Documentation

- **[ARCHITECTURE](docs/ARCHITECTURE.md)** - System architecture overview
- **[CONTRIBUTING](docs/CONTRIBUTING.md)** - Contribution guidelines
- **[CHANGELOG](docs/CHANGELOG.md)** - Version history and changes
- **[ROADMAP](docs/ROADMAP.md)** - Feature roadmap and milestones
- **[TODO](docs/TODO.md)** - Current branch tasks

## Development

**Languages:** TypeScript · Rust · Go

**Frameworks:** React · Tauri · Eino

[![Node.js](https://img.shields.io/badge/node-22.22.2-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/en/download)
[![pnpm](https://img.shields.io/badge/pnpm-11.4.0-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/installation)
[![Go](https://img.shields.io/badge/go-1.25.6-00ADD8?logo=go&logoColor=white)](https://go.dev/doc/install/)
[![Rust](https://img.shields.io/badge/rust-1.96.0-000000?logo=rust&logoColor=white)](https://www.rust-lang.org/tools/install)

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

## License

Licensed under the GNU General Public License v3.0. See `LICENSE`.
