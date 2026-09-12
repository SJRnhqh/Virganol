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
