# Branch TODO

- Branch: `feat/spirit-ui-windowheader`
- Parent: `feat/spirit`
- Goal: Finish the WindowHeader part sequence under `ROADMAP.md` 6.5; each
  part gets the same pass (JSX structure → data/behavior → styles slice).

## Current

- [ ] MacTrafficLightSpacer pass: lift the 60px traffic-light width into a
      named constant, review the framer-motion spring params, add the
      bilingual JSDoc.

## Planned

- [ ] Decide the parked `Breadcrumb` and `ModuleMenu` scaffolding: wire,
  restyle, or remove.
- [ ] Narrow store subscriptions in `SidebarToggle` and `SideSwitch` with
  selectors / `useShallow`.
- [ ] Resolve the `mr-26` coupling between the header controls and
  `WindowsWindowControls` (absolute trailing or a shared width contract).

## Completed

- [x] Wire Rsdoctor build analysis: `@rsdoctor/rspack-plugin` dev dependency,
      opt-in `build:doctor` scripts (ui + root delegate), zero config change,
      gated by `RSDOCTOR` env; note scripts are POSIX-shell only for now.
