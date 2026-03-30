# Virganol Development Guidelines

Virganol is an AI-native desktop IDE for scientists and engineers, built with a
React frontend, a Tauri/Rust desktop runtime, and a Go sidecar.

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
└── TODO.md          # Branch-level task breakdown
```

## Development Workflow
