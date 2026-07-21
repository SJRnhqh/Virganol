// dev/scripts/rust/comments/tests/outer-doc-comments.test.mjs
import { test } from "node:test";
import { parseArgs } from "node:util";

import { loadConfig } from "../config/load.mjs";
import { loadFixture } from "../fixtures/load.mjs";
import { assertOuterDocCommentsAdapter } from "../rules/outer-doc-comments.mjs";

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    adapter: {
      type: "string",
    },
  },
});
const adapter = values.adapter ?? loadConfig("outer-doc-comments").adapter;
assertOuterDocCommentsAdapter(adapter);

function loadOuterDocCommentsFixture(name) {
  return loadFixture("outer-doc-comments", name);
}

test.todo(`Outer Doc Comments fixtures (${adapter} adapter)`);
