// apps/ui/stylelint.config.mjs

const TAILWIND_AT_RULES = [
  "apply",
  "config",
  "custom-variant",
  "plugin",
  "reference",
  "source",
  "theme",
  "utility",
  "variant",
];

/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard"],
  overrides: [
    {
      files: ["src/styles/base.css", "src/styles/layouts.css"],
      extends: ["stylelint-config-recess-order"],
      plugins: ["stylelint-order"],
      rules: {
        "order/order": ["custom-properties", "declarations", "rules", "at-rules"],
      },
    },
  ],
  rules: {
    "at-rule-empty-line-before": [
      "always",
      {
        except: ["blockless-after-same-name-blockless", "first-nested"],
        ignore: ["after-comment"],
        ignoreAtRules: ["import"],
      },
    ],
    "at-rule-no-unknown": [true, { ignoreAtRules: TAILWIND_AT_RULES }],
    "at-rule-prelude-no-invalid": [true, { ignoreAtRules: TAILWIND_AT_RULES }],
    "color-hex-length": "long",
    "declaration-empty-line-before": null,
    "import-notation": "string",
    "selector-class-pattern": null,
  },
};
