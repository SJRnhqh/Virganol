// dev/scripts/rust/comments/tests/outer-doc-comments.test.mjs
import { test } from "node:test";
import { parseArgs } from "node:util";

import { loadConfig } from "../config/load.mjs";
import { loadFixture } from "../fixtures/load.mjs";
import { checkOuterDocComments } from "../rules/outer-doc-comments.mjs";

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    adapter: {
      type: "string",
    },
  },
});
const adapter = values.adapter ?? loadConfig("outer-doc-comments").adapter;

function checkOuterDocCommentsFixture(name) {
  const { source } = loadFixture("outer-doc-comments", name);

  return checkOuterDocComments({ adapter, source });
}

test.todo(`Outer Doc Comments fixtures (${adapter} adapter)`);
