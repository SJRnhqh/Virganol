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
│              (UI components, state, routing)                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Desktop Runtime                         │
│                     Rust + Tauri 🦀                         │
│         (native APIs, window management, security)          │
└─────────────────────────────────────────────────────────────┘
                              │
                         gRPC (protobuf)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Agent Sidecar                           │
│                      Go + Eino 🤖                           │
│            (AI orchestration, LLM integration)              │
└─────────────────────────────────────────────────────────────┘
```

## Architecture

### Communication Flow

1. **Frontend → Rust**: Tauri commands & events
2. **Rust → Go**: gRPC over localhost (dynamic port handshake)
3. **Go → LLM**: Eino framework for AI agent orchestration

### Why This Stack?

| Layer | Technology | Why |
| ------- | ------------ | ----- |
| UI | React + TS | Rich ecosystem, type safety, fast iteration |
| Desktop | Tauri + Rust | Small binaries, native performance, security |
| AI Agent | Go + Eino | Excellent concurrency, elegant LLM orchestration |
| IPC | gRPC | Type-safe, efficient binary protocol, language-agnostic |

### Dynamic Port Handshake

The Go sidecar starts on a random available port and prints `VIRGANOL_PORT=<port>`
to stdout. The Rust layer captures this, establishes gRPC connection, and we're
ready to chat with AI!

```txt
Rust spawns Go sidecar
         │
         ▼
Go: net.Listen("tcp", "127.0.0.1:0")
         │
         ▼
Go: fmt.Printf("VIRGANOL_PORT=%d\n", port)
         │
         ▼
Rust parses stdout, connects gRPC
         │
         ▼
🎉 Ready!
```

## Project Structure

```txt
Virganol/
├── apps/
│   ├── ui/               # React frontend
│   │   └── src/          # TypeScript + React components
│   ├── desktop/          # Tauri desktop wrapper
│   │   └── src-tauri/    # Rust backend
│   └── server/           # Go agent sidecar
│       ├── cmd/agent/    # Main entry point
│       └── proto/        # Protocol Buffers definitions
└── docs/                 # Documentation
```

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

This project is source-available for viewing only; no license is granted
and all rights are reserved.
