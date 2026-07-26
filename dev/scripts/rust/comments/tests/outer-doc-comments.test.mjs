// dev/scripts/rust/comments/tests/outer-doc-comments.test.mjs
import assert from "node:assert/strict";
import { describe, test } from "node:test";
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

function checkOuterDocCommentsFixture(fixtureName) {
  const { source } = loadFixture("outer-doc-comments", fixtureName);

  return checkOuterDocComments({ adapter, source });
}

describe("Outer Doc Comments fixtures", () => {
  test("accepts a documented free function", async () => {
    await assert.doesNotReject(() => checkOuterDocCommentsFixture("valid-free-function"));
  });
});
