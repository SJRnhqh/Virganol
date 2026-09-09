# Branch TODO

- Branch: `feat/spirit-react-align`
- Goal: Align the frontend with the existing reliability architecture and gradually establish frontend engineering practices.

## Current

- [ ] Evaluate Vite 8 versus Rsbuild for the React/Tauri frontend before selecting a replacement; current evidence supports a trial, not a migration decision.
- [ ] Explore frontend alignment with backend boundary errors and contracts.

## Planned

- [ ] Compare an isolated Rsbuild trial with Vite 8 on the same application and browser targets: cold start through first usable render, React/CSS HMR, production build time, and emitted JS/CSS size; record exact versions and repeated measurements with cache state controlled.
- [ ] Validate the Rsbuild trial with React and Tailwind CSS plugins, the HTML entry, `@/*` aliases, environment types, and the existing TypeScript/lint checks; preserve Tauri port `5173`, strict port handling, and `apps/ui/dist` output.
- [ ] Verify Tauri development and packaged application behavior: asset/chunk loading, CSP, WebView compatibility, and Provider command/event flows. Adopt Rsbuild only if compatibility passes and measured or concrete maintenance benefits justify migration; otherwise retain Vite.
- [ ] If adopting Rsbuild, remove obsolete Vite dependencies/configuration/cache cleanup entries and update development documentation. Evaluate Rstest separately when adding frontend behavior tests; defer Rslib, Rspress, Rsdoctor, and Rslint until a concrete need exists.
- [ ] Implement the agreed frontend contract alignment.
- [ ] Develop frontend coding conventions and testing practices through the changes.

## Completed

- [x] Assess Rstack against the current frontend (2026-09-09): Rsbuild is the application-level alternative; Vite 8 also uses a Rust bundler, so Rust implementation alone does not justify switching. References: [Vite 8](https://vite.dev/blog/announcing-vite8), [Rsbuild comparison](https://rsbuild.rs/guide/start/), [migration guide](https://rsbuild.rs/guide/migration/vite).
- [x] Verify the existing baseline with `pnpm -F @virganol/ui build`: TypeScript and Vite 7.3.1 build passed; one run reported 6.70 s bundling, 579.58 kB JS (164.04 kB gzip), and 85.59 kB CSS (13.14 kB gzip). The >500 kB chunk warning remains; this is not a Vite 8/Rsbuild benchmark or a full desktop build.
- [x] Establish the branch direction; leave implementation details for later discussion.
