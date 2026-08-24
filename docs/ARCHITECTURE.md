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

### Reality Driven Design

Reality Driven Design (RDD) derives technical structure from independently
attributable business realities.

```txt
Feature Domain
└── Business Realities
    ├── Subject Reality
    └── Process Reality
```

- **Feature Domain**: A cohesive business perspective centered on a product
  capability.
- **Business Reality**: An independently attributable unit of business meaning
  scoped to one or more feature domains.
- **Subject Reality**: A business participant or object with persistent
  identity.
- **Process Reality**: A business occurrence that unfolds over time and may span
  multiple subject realities.

### Module Organization

Virganol modules span the TypeScript frontend, Rust runtime, and Go sidecar
runtime.

#### TypeScript Frontend

#### Rust Runtime

The Rust runtime separates the Tauri command boundary from core modules,
organizing both by feature domain and business reality.

##### Command Modules

Command modules mirror feature domains and business realities at the Tauri
boundary, delegating behavior to Core Modules.

```txt
commands/
└── <feature-domain>/
    └── <reality>/
        ├── <command>.rs
        └── mod.rs
```

##### Core Modules

Core modules organize each feature domain into a foundation and services.

```txt
core/
├── shared/                    # Cross-domain realities and support
└── <feature-domain>/
    ├── constants/             # Static values
    │   └── <reality>/
    ├── models/                # Models, values, errors, and contracts
    │   └── <reality>/
    ├── interfaces/            # Traits and ports
    │   └── <reality>/
    └── services/              # Business behavior and adapters
        └── <process>/
            └── <subject>/
```

The intended dependency direction inside a feature domain is:

```txt
┌───────────────────────────────────┐
│ <feature-domain>                  │
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

#### Go Sidecar

---

## Reliability Architecture

Reliability in Virganol is organized around business realities through
contextualization, attributability, and observability.

### Contextualization

Reality Contexts carry business meaning as behavior unfolds.

```txt
Reality Context ◀── Business Reality
├── Base Context
│   └── Stage
│       ├── consume ──▶ Next Stage
│       └── derive ───▶ Stage View
└── Business Context
    ├── switch ───────▶ Other Business Context
    ├── handoff ◀────▶ Other Reality Context
    └── project ──────▶ Attribution Snapshot
```

### Attributability

Reality Errors preserve business attribution across boundaries.

```txt
Reality Error
├── Failure ◀── Source
├── Attribution Snapshot
│
│ project
▼
Boundary Error
├── Code
├── Message
└── Details
    ├── Scope
    ├── Attribution
    └── Suppression
```

### Observability

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
