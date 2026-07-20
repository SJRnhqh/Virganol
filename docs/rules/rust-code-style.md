# Virganol Rust Code Style

Project conventions for Rust source code.

## Comments

### Source File Header

- Scope: `**/*.rs`
- Rule:
  - Line: `1`
  - Pattern: `// <repository-relative-path>`
  - Separator: `/`

### Module Documentation

### Declaration Documentation

- Scope: `**/*.rs`
- Excludes: `**/mod.rs`
- Rule:
  - Targets:
    - Item Declarations:
      - Free functions
      - Structs, enums, unions, traits, and type aliases
      - Constants and statics
      - Declarative macro definitions
    - Associated Items:
      - Associated functions and methods
      - Associated constants
      - Associated types
    - Members:
      - Struct and union fields
      - Enum variants and their fields
  - Non-Targets:
    - Module declarations
    - Use declarations and reexports
    - Impl blocks themselves; their associated items remain in scope
    - Macro invocations in item or associated-item position
  - Pattern:

    ```rust
    /// <English>
    ///
    /// <Chinese with whitelisted ASCII terms>
    ```

### Explanatory Comments

## Visibility
