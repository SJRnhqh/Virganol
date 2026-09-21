import js from "@eslint/js";
import globals from "globals";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

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
    files: ["src/*.{ts,tsx}", "src/{types,constants,lib,store,hooks,components,layouts}/**/*.{ts,tsx}"],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^\\u0000@?\\w", "^@?\\w"],
            ["^\\u0000(?:@/|\\./)", "^@/", "^\\./"],
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
            {
              regex: "^\\.\\./",
              message: "Use @/ public entries for cross-directory imports.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/{types,constants,lib,store,hooks,components,layouts}/**/index.ts"],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/exports": "error",
    },
  },
]);
