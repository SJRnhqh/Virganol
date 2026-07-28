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

const outerDocLinePattern = /^\s*\/\/\/(?:\s|$)/;

function createMissingDocumentationCases(fixtureName) {
  const { source } = loadFixture("outer-doc-comments", fixtureName);
  const lines = source.split(/\r?\n/);
  const cases = [];
  let lineIndex = 0;

  while (lineIndex < lines.length) {
    if (!outerDocLinePattern.test(lines[lineIndex])) {
      lineIndex += 1;
      continue;
    }

    const blockStart = lineIndex;

    while (lineIndex < lines.length && outerDocLinePattern.test(lines[lineIndex])) {
      lineIndex += 1;
    }

    const blockEnd = lineIndex;

    assert.equal(
      blockEnd - blockStart,
      3,
      `${fixtureName}:${blockStart + 1} must contain a three-line outer doc block`
    );

    const missingDocumentationLines = [...lines];

    missingDocumentationLines.fill("", blockStart, blockEnd);

    cases.push({
      fixtureName,
      lineNumber: blockStart + 1,
      source: missingDocumentationLines.join("\n"),
    });
  }

  assert.ok(cases.length > 0, `${fixtureName} must contain at least one outer doc block`);

  return cases;
}

const documentedTargetFixtureNames = [
  "valid-free-function",
  "valid-struct",
  "valid-enum",
  "valid-trait",
  "valid-type-alias",
  "valid-constant",
  "valid-anonymous-constant",
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

const missingDocumentationCases = documentedTargetFixtureNames.flatMap((fixtureName) =>
  createMissingDocumentationCases(fixtureName)
);
const missingBoundaryFixtureNames = [
  "missing-inline-struct-field",
  "missing-adjacent-struct",
  "missing-source-start-struct",
];

describe("Outer Doc Comments", () => {
  describe("documented targets", () => {
    for (const fixtureName of documentedTargetFixtureNames) {
      test(`accepts ${fixtureName}`, async () => {
        await assert.doesNotReject(() => checkOuterDocCommentsFixture(fixtureName));
      });
    }
  });

  describe("missing documentation", () => {
    for (const { fixtureName, lineNumber, source } of missingDocumentationCases) {
      test(`reports for ${fixtureName}:${lineNumber} without documentation`, async () => {
        await assert.rejects(
          () => checkOuterDocComments({ adapter, source }),
          /missing outer doc comment/
        );
      });
    }

    for (const fixtureName of missingBoundaryFixtureNames) {
      test(`reports for ${fixtureName}`, async () => {
        await assert.rejects(
          () => checkOuterDocCommentsFixture(fixtureName),
          /missing outer doc comment/
        );
      });
    }
  });
});
