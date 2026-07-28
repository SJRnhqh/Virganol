# Virganol Rust Code Style

Project conventions for Rust source code.

## Comments

### Source File Header

- Scope: `**/*.rs`
- Rule:
  - Line: `1`
  - Pattern: `// <repository-relative-path>`
  - Separator: `/`

### Outer Doc Comments

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

### Inner Doc Comments

### Explanatory Comments

## Visibility
