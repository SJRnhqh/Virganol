import js from "@eslint/js";
import boundaries from "eslint-plugin-boundaries";
import importX from "eslint-plugin-import-x";
import globals from "globals";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

const moduleDirs = "{types,constants,lib,store,hooks,components,layouts}";

const srcFiles = [
  `src/${moduleDirs}/**/*.{ts,tsx}`,
  "src/*.{ts,tsx}",
];

const barrelFiles = [`src/${moduleDirs}/**/index.ts`];

const noImportComments = {
  meta: {
    type: "suggestion",
    schema: [],
    messages: {
      moveComment: "Move this comment above the import block.",
      keepCommentFlush: "Keep this comment flush with the first import.",
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const body = node.parent.body;
        const index = body.indexOf(node);
        if (!body.slice(0, index).some((stmt) => stmt.type === "ImportDeclaration")) {
          const last = context.sourceCode.getCommentsBefore(node).at(-1);
          if (last) {
            const gap = node.loc.start.line - last.loc.end.line;
            if (gap === 0) {
              context.report({ loc: last.loc, messageId: "moveComment" });
            } else if (gap > 1) {
              context.report({ loc: last.loc, messageId: "keepCommentFlush" });
            }
          }
        }
        const prev = body[index - 1];
        if (prev?.type === "ImportDeclaration") {
          for (const comment of context.sourceCode.getCommentsBefore(node)) {
            context.report({ loc: comment.loc, messageId: "moveComment" });
          }
        }
        for (const comment of context.sourceCode.getCommentsInside(node)) {
          context.report({ loc: comment.loc, messageId: "moveComment" });
        }
        if (body[index + 1]?.type !== "ImportDeclaration") {
          for (const comment of context.sourceCode.getCommentsAfter(node)) {
            if (comment.loc.start.line === node.loc.end.line) {
              context.report({ loc: comment.loc, messageId: "moveComment" });
            }
          }
        }
      },
    };
  },
};

const sharedSyntax = [
  {
    selector: "EmptyStatement",
    message: "Remove empty statements; keep imports in one sortable block.",
  },
  {
    selector: "ImportExpression",
    message: "Use static imports only; dynamic import() is not allowed.",
  },
  {
    selector:
      "ExportNamedDeclaration[source][attributes.length>0], ExportAllDeclaration[attributes.length>0]",
    message: "Write re-exports without attributes.",
  },
];

const importSyntax = [
  {
    selector: "ImportDeclaration > Literal.source[raw=/^'/]",
    message: "Use double quotes in imports.",
  },
  {
    selector: "ImportSpecifier > Literal.imported",
    message: "Use identifiers for imported names.",
  },
  {
    selector: "ImportDeclaration[attributes.length>0]",
    message: "Write imports without attributes; loaders need no metadata here.",
  },
  {
    selector:
      String.raw`ImportDeclaration > Literal.source[raw=/(?:^|[^\\])(?:\\\\)*\\[ux\r\n\u2028\u2029]/]` +
      String.raw`:not([value=/^(?:@|\.)\u002Ffeatures(?:\u002F|$)/])` +
      String.raw`:not([value=/\.css(?:[?#].*)?$/i])`,
    message:
      "Write import sources directly without Unicode/hexadecimal escapes or line continuations.",
  },
];

const reExportSyntax = [
  {
    selector: "ExportNamedDeclaration[source]",
    message: "Re-export through index.ts module entries only.",
  },
  {
    selector: "ExportAllDeclaration",
    message: "Re-export through index.ts module entries only.",
  },
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

const moduleTypes = Object.keys(dependencyAllows);

const boundaryPolicies = [
  ...Object.entries(dependencyAllows).map(([from, allow]) => ({
    from: { element: { type: from } },
    allow: [{ to: { element: { type: [...allow, from] } } }],
  })),
  ...moduleTypes.map((from) => ({
    from: { element: { type: from } },
    to: {
      element: {
        type: moduleTypes.filter((type) => type !== "app" && type !== from),
      },
    },
    disallow: [
      { dependency: { source: ["!@/**", "@/**/index{,.*}"] } },
      { to: { element: { fileInternalPath: "!index.ts" } } },
    ],
    message: "Use @/ public entries without /index.",
  })),
  {
    from: { element: { type: moduleTypes } },
    dependency: { relationship: { from: "internal" } },
    disallow: {
      dependency: {
        source: [
          "!+([.]/|[.][.]/)**",
          "+([.]/|[.][.]/)?(**/)*.{js,jsx,ts,tsx}",
        ],
      },
    },
    message: "Use relative paths without script extensions within modules.",
  },
];

const tsResolver = {
  typescript: {
    alwaysTryTypes: true,
    project: "tsconfig.app.json",
  },
};

const importRules = {
  "local/no-import-comments": "error",
  "import-x/first": "error",
  "import-x/newline-after-import": [
    "error",
    { count: 1, exactCount: true, considerComments: true },
  ],
  "import-x/no-empty-named-blocks": "error",
  "import-x/no-named-default": "error",
  "import-x/no-namespace": "error",
  "import-x/no-rename-default": "error",
  "no-duplicate-imports": "error",
  "no-useless-rename": [
    "error",
    { ignoreExport: true, ignoreDestructuring: true },
  ],
  "@typescript-eslint/consistent-type-imports": [
    "error",
    {
      prefer: "type-imports",
      fixStyle: "inline-type-imports",
    },
  ],
  "@typescript-eslint/no-import-type-side-effects": "error",
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
};

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
  },
  {
    files: srcFiles,
    settings: {
      "import/resolver": tsResolver,
      "import-x/resolver": tsResolver,
      "import-x/extensions": [".js", ".jsx", ".ts", ".tsx"],
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
      boundaries,
      "import-x": importX,
    },
    rules: {
      "no-restricted-syntax": ["error", ...sharedSyntax],
      "import-x/no-useless-path-segments": "error",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "/$",
              message: "Omit trailing slashes in import sources.",
            },
            {
              regex: "^node:",
              message: "Node.js built-in modules are not allowed in UI source.",
            },
          ],
        },
      ],
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          checkInternals: true,
          policies: boundaryPolicies,
        },
      ],
    },
  },
  {
    files: srcFiles,
    ignores: barrelFiles,
    plugins: {
      "import-x": importX,
      "simple-import-sort": simpleImportSort,
      local: { rules: { "no-import-comments": noImportComments } },
    },
    rules: {
      ...importRules,
      "no-restricted-syntax": [
        "error",
        ...sharedSyntax,
        ...importSyntax,
        ...reExportSyntax,
      ],
    },
  },
  {
    files: barrelFiles,
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/exports": "error",
      "no-restricted-syntax": [
        "error",
        ...sharedSyntax,
        {
          selector: "ImportDeclaration",
          message: "Keep index.ts barrels pure; write re-exports only.",
        },
      ],
    },
  },
]);
