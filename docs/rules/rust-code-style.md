# Virganol Rust Code Style

Project conventions for Rust source code.

## Comments

The Rust Comments Check is Virganol's Rust comment quality-gate subsystem. Its
implementation and related engineering experiments live under
`dev/scripts/rust/comments/`.

### Source File Header

#### Specification

- Scope: `**/*.rs`
- Rule:
  - Line: `1`
  - Pattern: `// <repository-relative-path>`
  - Separator: `/`

#### Engineering

```text
Check
├── Test
│   ├── fixture
│   └── rule
└── Audit
    ├── file
    └── guard
        └── rule
```

### Outer Line Doc Comments

#### Specification

- Scope: `**/*.rs`
- Excludes: `**/mod.rs`
- Rule:
  - Targets (Required):
    - Item Declarations:
      - Free functions
      - Structs, enums, unions, traits, and type aliases
      - Constants and statics
      - Declarative macro definitions
    - Associated Items:
      - Associated functions and methods
      - Associated constants
      - Associated types
    - External Items:
      - Functions and statics declared in extern blocks
    - Members:
      - Struct and union fields
      - Enum variants and their fields
  - Excludes (Prohibited):
    - Module declarations
    - Extern crate declarations
    - Use declarations and reexports
    - Impl blocks themselves; their associated items remain in scope
    - Extern blocks themselves; their external items remain in scope
    - Macro invocations in item, associated-item, or external-item position
  - Pattern:

    ```rust
    /// <English>
    ///
    /// <Chinese with whitelisted ASCII terms>
    ```

#### Engineering

```text
Check
├── Test
│   ├── fixture (TBD)
│   └── rule
└── Audit
    ├── file
    └── guard
        └── rule
```

```text
Benchmark (TBD)
├── Comparisons
│   ├── Adapter
│   │   ├── CLI
│   │   └── NAPI
│   ├── Execution
│   │   ├── sequential
│   │   └── concurrent
│   └── Input
│       ├── source
│       └── path
└── Scenarios
    ├── Test
    └── Audit
```

### Inner Doc Comments (Specification TBD)

### Explicit Doc Attributes (Policy TBD)

- Scope: `**/*.rs`
- Forms:
  - Outer: `#[doc = "<content>"]`
  - Inner: `#![doc = "<content>"]`
- Rule:
  - Explicit doc attributes are prohibited.

### Ordinary Comments (Specification TBD)

## Visibility (Specification TBD)

### Temporary Re-export Visibility Check

- Runner: `dev/scripts/rust/contract-reexport-visibility.mjs`
- Configuration: `dev/scripts/rust/config/contract/reexport-visibility.config.mjs`
- Entry: `dev/scripts/rust/test.mjs`
- Status: Incomplete; retire this check when the complete Visibility quality
  gate is implemented.
