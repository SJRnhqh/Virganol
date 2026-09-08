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

```txt
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

```txt
Check
├── Test
│   ├── fixture (TBD)
│   └── rule
└── Audit
    ├── file
    └── guard
        └── rule
```

```txt
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

## Imports and Paths (Specification TBD)

### Relative Path Discipline (Policy TBD)

#### Specification (Verification TBD)

- Scope: `apps/desktop/src-tauri/src/**/*.rs`
- Rule:
  - External crates are consumed through explicit imports only; inline
    fully-qualified external paths in expressions are prohibited.
  - Modules under `core/` never import through absolute `crate::` paths;
    they reach sibling and ancestor items through `super::` chains resolved
    by per-module re-export hubs.
  - Modules under `container/` may import through absolute `crate::` paths.

## Visibility (Specification TBD)

### Re-export Visibility Boundaries (Policy TBD)

#### Specification (Verification TBD)

- Scope: `apps/desktop/src-tauri/src/**/*.rs`
- Rule:
  - A re-export may not widen visibility beyond the item's declared
    visibility (`E0364`).
  - An item's declared visibility must cover the widest hop of its re-export
    chain; intermediate hops re-export with `pub(super)` or `pub(self)`.
  - A variant payload type must not be less visible than the enum carrying
    it (`private_interfaces`).

### Temporary Re-export Visibility Check

- Runner: `dev/scripts/rust/contract-reexport-visibility.mjs`
- Configuration: `dev/scripts/rust/config/contract/reexport-visibility.config.mjs`
- Entry: `dev/scripts/rust/test.mjs`
- Status: Incomplete; retire this check when the complete Visibility quality
  gate is implemented.

## Item and Implementation Order (Specification TBD)

### Type Implementation Order (Policy TBD)

#### Specification (Verification TBD)

- Scope: `**/*.rs` (manual `impl` blocks; derive-generated implementations are
  out of scope)
- Rule:
  - A type declaration is immediately followed by its inherent impl, when one
    exists.
  - Trait impls follow the inherent impl, ordered by tier:
    1. Conversion traits (`From`, `TryFrom`, `FromStr`, `AsRef`)
    2. Presentation traits (`Display`, `Debug`)
    3. Error traits (`StdError`)
    4. External protocol traits (`Write`, `Visit`, `FormatFields`)
    5. Lifecycle traits (`Drop`, `Default`, `Downgrade`)
  - Unlisted trait impls follow the listed tiers.
  - Pattern:

    ```txt
    type declaration
    → inherent impl
    → conversion trait impls    # From / TryFrom / FromStr / AsRef
    → presentation trait impls  # Display / Debug
    → error trait impls         # StdError
    → protocol trait impls      # Write / Visit / FormatFields
    → lifecycle trait impls     # Drop / Default / Downgrade
    ```
