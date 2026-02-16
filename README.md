# Virganol 🧪

> A modern desktop application for electronic laboratory notebooks, built with
love and cutting-edge technology.

## Tech Stack

**Languages:** TypeScript · Rust · Go

**Frameworks:** React · Tauri · Eino

```txt
┌─────────────────────────────────────────────────────────────┐
│                      Frontend Layer                         │
│                  TypeScript + React                         │
│           (pure rendering, zero persistence)                │
└─────────────────────────────────────────────────────────────┘
                              │
                        Tauri Commands
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Desktop Runtime (Landlord)                │
│                     Rust + Tauri 🦀                         │
│    (native APIs, persistence, security, sidecar lifecycle)  │
└─────────────────────────────────────────────────────────────┘
                              │
                         gRPC (protobuf)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Agent Sidecar (Tenant)                    │
│                      Go + Eino 🤖                           │
│     (AI orchestration, scoped file I/O within dataDir)      │
└─────────────────────────────────────────────────────────────┘
```

## Architecture

### Layer Responsibilities

| Layer | Technology | Responsibility |
| --- | --- | --- |
| UI | React + TS | Pure rendering, state management, user interaction |
| Desktop | Tauri + Rust | Persistence, provider connections, security, sidecar lifecycle |
| AI Agent | Go + Eino | AI orchestration, scoped storage, future sandboxed execution |
| IPC | gRPC | Type-safe binary protocol between Rust and Go |

### Landlord-Tenant Model

Rust acts as the **landlord** — it controls the application lifecycle, manages
sensitive data (API keys), and decides what resources Go can access.

Go acts as a **tenant** — it receives a scoped directory (`--app-data-dir`) from
Rust at startup and can only perform file I/O within that boundary.

```txt
Rust (Landlord)
├── Provider connection & validation (direct HTTP)
├── Persistence (tauri-plugin-store)
│   ├── config.json        ← provider settings (plain text)
│   └── secrets            ← API keys (separate, secure)
└── Sidecar lifecycle management
      ↓ gRPC
Go (Tenant, scoped to dataDir)
├── BaseService            ← Ping + Shutdown (lifecycle)
├── ConfigService          ← Scoped read/write (reserved)
└── [Future] AgentService  ← AI chat, code execution, SQLite
```

### Dynamic Port Handshake

The Go sidecar starts on a random available port and prints `VIRGANOL_PORT=<port>`
to stdout. Rust captures this and establishes the gRPC connection.

```txt
Rust spawns Go sidecar with --app-data-dir=/scoped/path
         │
         ▼
Go: net.Listen("tcp", "127.0.0.1:0")
         │
         ▼
Go: fmt.Printf("VIRGANOL_PORT=%d\n", port)
         │
         ▼
Rust parses stdout, connects gRPC, sends Ping
         │
         ▼
🎉 Ready!
```

## Project Structure

```txt
Virganol/
├── apps/
│   ├── ui/                    # React frontend
│   │   └── src/
│   │       ├── components/    # Global UI components
│   │       ├── features/      # Feature modules (bot, node, ...)
│   │       ├── layouts/       # Page layouts
│   │       └── store/         # Global state
│   ├── desktop/               # Tauri desktop wrapper
│   │   └── src-tauri/
│   │       └── src/
│   │           ├── commands/  # Tauri commands (frontend API)
│   │           └── core/      # Sidecar manager, gRPC, providers
│   └── server/                # Go agent sidecar
│       ├── cmd/agent/         # Entry point
│       ├── internal/          # gRPC server, lifecycle, health
│       ├── pkg/service/       # Service implementations
│       └── proto/             # Protocol Buffers definitions
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
