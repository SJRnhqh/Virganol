import js from "@eslint/js";
import boundaries from "eslint-plugin-boundaries";
import globals from "globals";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

const srcFiles = [
  "src/{types,constants,lib,store,hooks,components,layouts}/**/*.{ts,tsx}",
  "src/*.{ts,tsx}",
];

const dependencyAllows = {
  types: [],
  constants: ["types"],
  lib: [],
  store: ["types", "constants"],
  hooks: ["types", "constants", "store"],
  components: ["types", "constants", "lib", "store", "hooks", "features"],
  layouts: ["lib", "store", "hooks", "components"],
  app: ["features", "layouts", "styles"],
};

const dependencyPolicies = Object.entries(dependencyAllows).map(
  ([from, allow]) => ({
    from: { element: { type: from } },
    allow: [{ to: { element: { type: [...allow, from] } } }],
  }),
);

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "comma-spacing": ["error", { before: false, after: true }],
    },
  },
  {
    files: srcFiles,
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "tsconfig.app.json",
        },
      },
      "boundaries/elements": [
        { type: "types", pattern: "src/types/**" },
        { type: "constants", pattern: "src/constants/**" },
        { type: "lib", pattern: "src/lib/**" },
        { type: "store", pattern: "src/store/**" },
        { type: "hooks", pattern: "src/hooks/**" },
        { type: "features", pattern: "src/features/**" },
        { type: "components", pattern: "src/components/**" },
        { type: "layouts", pattern: "src/layouts/**" },
        { type: "styles", pattern: "src/styles/**" },
        { type: "app", pattern: "src" },
      ],
    },
    plugins: {
      "simple-import-sort": simpleImportSort,
      boundaries,
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^\\u0000@?\\w", "^@?\\w"],
            [
              "^\\u0000(?:@/|\\./)",
              "^@/types(?:/|\\u0000|$)",
              "^@/constants(?:/|\\u0000|$)",
              "^@/lib(?:/|\\u0000|$)",
              "^@/store(?:/|\\u0000|$)",
              "^@/hooks(?:/|\\u0000|$)",
              "^@/features(?:/|\\u0000|$)",
              "^@/components(?:/|\\u0000|$)",
              "^@/layouts(?:/|\\u0000|$)",
              "^@/",
              "^\\./",
              "^\\.\\./",
            ],
          ],
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^node:",
              message: "Node.js built-in modules are not allowed in UI source.",
            },
          ],
        },
      ],
      "boundaries/dependencies": [
        "error",
        { default: "disallow", policies: dependencyPolicies },
      ],
    },
  },
  {
    files: [
      "src/{types,constants,lib,store,hooks,components,layouts}/**/index.ts",
    ],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/exports": "error",
    },
  },
]);
