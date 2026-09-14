# Virganol CSS Code Style

Project conventions for CSS source code.

## Comments (Specification TBD)

### Source File Header

#### Specification

- Scope: `apps/ui/**/*.css`
- Rule:
  - Line: `1`
  - Pattern: `/* <repository-relative-path> */`
  - Separator: `/`

#### Engineering (Implementation TBD)

### Block Comments (Policy TBD)

- Targets: TBD
- Rule:
  - Write the English description first and the Chinese description second.
  - Separate the two descriptions with one blank comment line.
- Pattern:

  ```css
  /*
   * <English sentence.>
   *
   * <Chinese sentence。>
   */
  ```

## Paths

### Index (Policy TBD)

- Scope: `apps/ui/**/index.css`
- Rule:
  - Keep all `@import` statements at the top level.
  - Import third-party styles before project styles.
  - Separate third-party and project imports with one blank line.
  - Keep project imports in dependency order.
- Pattern:

  ```css
  @import "<third-party>";

  @import "./<project-stylesheet>.css";
  ```
