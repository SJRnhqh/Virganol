# Branch TODO

- Branch: `feat/spirit-ui-polish`
- Parent: `feat/spirit`
- Goal: Continue the frontend shell polish queued in `ROADMAP.md` 6.5, with
  the store layer as the branch's main focus after the boundaries gate.

## Current

- [ ] CSS style-pipeline evaluation (PandaCSS vs vanilla-extract vs StyleX):
  prototype the `layouts.css` semantics as typed recipes/patterns, keep the
  token and base layers as plain CSS for the transition, weigh Panda's
  authoring DX, vanilla-extract's theme contracts (relevant if the workbench
  grows light/dark themes), and StyleX's scale-proven atomic output (least
  relevant for a desktop app), and decide whether the pure-TS end state
  (typed authoring, static CSS output) beats the current lint-disciplined
  plain-CSS approach before adopting a second styling pipeline. Runs
  alongside the store slice without touching it.
- [ ] Sidebar store consumers: move whole-store destructuring consumers to
  fine-grained selectors (`useSidebarStyles`, `SidebarToggle`, `SideSwitch`,
  `useKeyboardShortcuts`), using `useShallow` object picks as in
  the bot feature hooks.

## Planned

- [ ] Revisit native `@scope` when component-level structure emerges (sidebar
  internals, module decks): evaluate scoping selectors with the donut form
  (`@scope (...) to (...)`) as the BEM-prefix alternative, keeping the global
  `@layer` shell styles as they are, and settle the split between layer and
  scope in the CSS discipline.
- [ ] Decide and align `MainStage` with the navigation vocabulary: replace the
  local `activeId: string` props with the derived-props pattern under
  `types/props/` (same shape as `SidebarProps`).
- [ ] Consider unifying the nav id sources: derive `NavId` from an
  `NAV_IDS as const` list instead of the hand-written union, so
  `constants/navigation.ts` and `types/navigation.ts` share one fact source.
- [ ] Tighten `handleKeyDown` dependency injection: move `ShortcutDeps` to
  `types/hotkeys.ts` and compose it with `Pick` over the store states.
- [ ] After the sidebar slice, settle the settings follow-ups: decide
  `settings.toggle` (give the Cmd+, hotkey `deps.toggle` vs narrowing the
  slice with `Pick`) and confirm the bare-open-keeps-last-tab semantics.
- [ ] Clear the inherited review finding: fix the `osType` Promise bug in
  `WindowHeader`. Keep the parked `ModuleMenu` component and its commented
  `Breadcrumb` scaffolding unless decided otherwise.
- [ ] Decide the reverse-waterfall strategy for absorbing `features/` into the
  boundaries gate and codify the `../` vs `@/` range-layering verdict once a
  rule shape is found (currently manual: cross-directory shell imports use
  `@/`, same-package relatives are tolerated).

## Completed

- [x] Refine MainLayout store subscriptions: select only `side` from
  `SidebarStore` and combine `activeNavId` / `setActiveNavId` from
  `NavigationStore` in one `useShallow` object pick. TypeScript and targeted
  ESLint checks passed; other sidebar consumers remain in Current.
- [x] Complete the current SidebarStore container polish: keep `side` as the
  sidebar-owned docking value, make `toggleSide` a synchronous left/right
  update, and remove `isSwitching`, the 80ms wait, the re-entry guard, and the
  unused `get` parameter. Align `SidebarState.toggleSide` with `void` and
  remove switch-only fading from `useSidebarStyles` while retaining the
  open/close animation. Consumer selector cleanup remains in Current.
- [x] Refine the disclosure contract and factory boundary: make
  `DisclosureState` extend a private `DisclosureValue` interface containing
  only `isOpen`, keep the value interface at the file end with bilingual
  JSDoc, and narrow `DisclosureUpdater` to value-only reads and updates.
  Name the factory parameter `updater` and its callback parameter `value`,
  retain container-owned initial values, and use a whole-import `type` in
  `SidebarStore`. TypeScript and targeted ESLint checks passed.
- [x] Land the CSS ordering and comment discipline for the shell styles: add
  `stylelint-config-recess-order` + `stylelint-order`, scope the ordering
  override to `base.css` and `layouts.css`, move the body `@apply` after its
  declarations to satisfy the at-rules-last order, and annotate both layout
  rules with per-field bilingual intent comments (one block per intent group,
  field-per-line with clamp-style Chinese labels; the `data-side` modifier
  comment states its own vocabulary without child leakage).
- [x] Extract MainLayout container styles into `styles/layouts.css`, express
  sidebar direction through `data-side`, and load styles centrally through
  `styles/index.css` without direct layout-to-styles imports.
  Name the work area `main-layout__workspace`, nest its direction condition,
  and remove the redundant shell background and default row declaration.
- [x] Polish the layouts comment: state the identity in `MainLayout`
  (`shell layout of the application`), dropping the child-responsibility
  leakage; the wiring zone (sidebar selectors) is now completed above and
  the JSX zone reduces to composition plus the className question.
- [x] Polish the entry-layer comments: state the mount causality in
  `main.tsx` (render the root component to mount the app) and the identity in
  `App.tsx` (root component of the application); seed comment conventions for
  the future code-style rule: identity over behavior, Chinese text avoids
  English words, `of` phrasing.
- [x] Surface the three planned module decks in `NAV_ITEMS`: uncomment the
  Mead, Apiary, and Bar entries with their lucide imports (alphabetized), so
  every `NavId` member has an active entry; drop the icon inline comments as
  what-comments.
- [x] Migrate the navigation state out of the sidebar: land the `NavId` union
  and `NavItemConfig` in the types layer, add a `NavigationState` contract
  with its own `NavigationStore` container, rewire Breadcrumb, MainLayout,
  useSmartSettings, Sidebar (via the derived `SidebarProps`), and the parked
  ModuleMenu, and drop `activeId`/`setActiveId` from the sidebar store and
  contract. The default nav id reads `NAV_ITEMS[0].id` inline; a standalone
  `DEFAULT_NAV_ID` constant was tried and dropped as unnecessary.
- [x] Establish the derived-props convention: `types/props/` holds component
  props derived from state contracts via `Pick` (type alias form); hand-written
  shapes stay `interface`.
- [x] Open two boundaries edges with consumers to justify them:
  `store -> constants` (default nav id reads `NAV_ITEMS`) and
  `components -> types` (derived props and vocabulary imports).

- [x] Seed the branch from `feat/spirit` at `ce368be9` (post #42 squash
  merge).
- [x] Land the shell dependency-direction gate: restored the stashed
  boundaries wiring, tightened the policy matrix to actual per-layer usage in
  canonical layer order, generated policies from an explicit allows table, and
  approved the `unrs-resolver` build script in `pnpm-workspace.yaml`.
- [x] Extract `DisclosureState` and compose it into `SidebarState`,
  mirror the interface order in the store with paired state/action members
  and bilingual member JSDoc, and drop the dead `setOpen`/`setSide` actions.
- [x] Wire the settings store into the disclosure slice: extend
  `SettingsState`, rename the actions to `open`/`close`, migrate the hotkeys,
  settings modal, and smart-settings consumers; a bare open now keeps the
  last tab instead of resetting to general.
- [x] Extract the `createDisclosure` factory backed by a `DisclosureUpdater`
  contract in the types layer, unify the `isOpen` vocabulary across hotkeys,
  and merge parent and sibling imports into one sorted group.
