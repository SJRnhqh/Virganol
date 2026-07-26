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

const documentedTargetFixtureNames = [
  "valid-free-function",
  "valid-struct",
  "valid-enum",
  "valid-trait",
  "valid-type-alias",
  "valid-constant",
  "valid-static",
  "valid-declarative-macro",
  "valid-attributed-struct",
  "valid-struct-fields",
  "valid-enum-variants-and-fields",
  "valid-union-fields",
  "valid-trait-associated-items",
  "valid-impl-associated-items",
  "valid-extern-items",
];

describe("Outer Doc Comments", () => {
  describe("documented targets", () => {
    for (const fixtureName of documentedTargetFixtureNames) {
      test(`accepts ${fixtureName}`, async () => {
        await assert.doesNotReject(() => checkOuterDocCommentsFixture(fixtureName));
      });
    }
  });
});
