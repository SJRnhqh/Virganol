# Virganol Architecture

> Virganol's system and reliability architecture, supported by engineering
> infrastructure.

---

## System Architecture

### Runtime Architecture

Virganol is a modern desktop application built with a three-layer architecture:

```txt
┌─────────────────────────────────────────────────────────────┐
│                   Frontend Layer (React)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                        Tauri Commands
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Desktop Runtime (Tauri)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                         gRPC (protobuf)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Agent Sidecar (Eino)                     │
└─────────────────────────────────────────────────────────────┘
```

### Backend Module Organization

Backend modules cover Rust runtime modules and the Go sidecar runtime.

#### Rust Runtime Modules

Rust runtime modules currently cover the Tauri command boundary and backend
core modules, using **domain modules** and **subdomain modules** as their
primary semantic organization units.

##### Command Modules

Command modules are organized by domain and subdomain at the Tauri
boundary, with each command backed by a function exported by Core Modules.

```txt
commands/
└── <domain>/
    └── <subdomain>/
        ├── <command>.rs
        └── mod.rs
```

##### Core Modules

Core modules add internal layers under each domain module.

```txt
core/
├── shared/                    # Cross-domain core support
└── <domain>/                  # Domain module
    ├── constants/             # Static values local to the domain
    ├── models/                # Data models, value objects, errors, contracts
    │   └── <subdomain>/       # Subdomain models
    ├── interfaces/            # Traits and ports expressed with models
    │   └── <subdomain>/       # Subdomain interfaces
    └── services/              # Domain behavior and infrastructure adapters
        └── <subdomain>/       # Subdomain services
```

The intended dependency direction inside a domain is:

```txt
┌───────────────────────────────────┐
│ <domain>                          │
│           ┌───────────┐           │
│           │ services  │           │
│           └───────────┘           │
│                 │                 │
│                 ▼                 │
│ ┌───────────────────────────────┐ │
│ │       domain foundation       │ │
│ │                               │ │
│ │ ┌────────────┐                │ │
│ │ │ interfaces │                │ │
│ │ └────────────┘  ┌───────────┐ │ │
│ │       │         │ constants │ │ │
│ │       ▼         └───────────┘ │ │
│ │   ┌────────┐                  │ │
│ │   │ models │                  │ │
│ │   └────────┘                  │ │
│ └───────────────────────────────┘ │
└───────────────────────────────────┘
```

#### Go Sidecar Modules

---

## Reliability Architecture

### Context Propagation

### Error Architecture

### Observability

#### Structured Logging

#### Tracing

---

## Engineering Infrastructure

Engineering infrastructure supports Virganol's development, verification,
build, and delivery workflows without participating in the product runtime.

### Quality Gate System

The quality gate system verifies repository changes at defined stages of the
development lifecycle.

#### Subsystems

The quality gate system consists of two complementary subsystems:

```txt
Quality Gate System
├── Check
└── Test
```

- **Check** validates repository conformance to project rules and contracts.
- **Test** validates implementation behavior against expected outcomes.

#### Organization

Verification is organized by scope:

```txt
Repository Entry
└── Technology Stack
    └── Quality Area
```
