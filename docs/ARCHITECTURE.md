# Virganol Architecture

> Project architecture, runtime boundaries, and reliability design

---

## System Architecture

### Runtime Topology

Virganol is a modern desktop application built with a three-layer architecture:

```txt
┌─────────────────────────────────────────────────────────────┐
│                      Frontend Layer                         │
│                  TypeScript + React                         │
│              (UI rendering, in-memory state)                │
└─────────────────────────────────────────────────────────────┘
                              │
                        Tauri Commands
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Desktop Runtime (Landlord)                │
│                     Rust + Tauri 🦀                         │
│         (native APIs, disk storage, sidecar lifecycle)      │
└─────────────────────────────────────────────────────────────┘
                              │
                         gRPC (protobuf)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Agent Sidecar (Tenant)                    │
│                      Go + Eino 🤖                           │
│            (scoped file I/O, future AI features)            │
└─────────────────────────────────────────────────────────────┘
```

### Landlord-Tenant Model

**Rust (Landlord)**: Controls lifecycle, manages secrets, grants scoped
access to Go

**Go (Tenant)**: Receives `--app-data-dir` from Rust, file I/O limited to
that directory

---

## Reliability Architecture

### Context Propagation

### Error Architecture

### Observability

#### Structured Logging

#### Tracing

### Testing Strategy
