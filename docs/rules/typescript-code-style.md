# Virganol TypeScript Code Style

Project conventions for TypeScript source code.

## Comments (Specification TBD)

### Source File Header

#### Specification

- Scope: `apps/ui/src/**/*.{ts,tsx}`
- Rule:
  - Line: `1`
  - Pattern: `// <repository-relative-path>`
  - Separator: `/`

#### Engineering (Implementation TBD)

### JSDoc (Policy TBD)

- Scope: `apps/ui/src/**/*.{ts,tsx}`
- Targets: Exported symbols.
- Rule:
  - Place the JSDoc block immediately before its target.
  - Write one English sentence, one blank comment line, then one Chinese
    sentence.
  - Add details only for project-specific or non-obvious facts.
- Pattern:

  ```ts
  /**
   * <English sentence.>
   *
   * <Chinese sentence。>
   */
  export <symbol>;
  ```

## Paths (Specification TBD)

### Index (Policy TBD)

- Scope: `apps/ui/src/**/index.ts`
- Rule:
  - Re-export same-directory symbols through direct relative paths.

### Imports (Policy TBD)

- Scope: `apps/ui/src/**/*.{ts,tsx}`
- Rule:
  - Import a different directory through its `index.ts` public entry point.
  - Use direct relative imports only within the same directory.
