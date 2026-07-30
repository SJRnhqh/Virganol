// dev/scripts/rust/comments/tests/outer-line-doc-comments.test.mjs
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { parseArgs } from "node:util";

import { loadConfig } from "../config/load.mjs";
import { loadFixture } from "../fixtures/load.mjs";
import { checkOuterLineDocComments } from "../rules/outer-line-doc-comments.mjs";

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    adapter: {
      type: "string",
    },
  },
});
const adapter = values.adapter ?? loadConfig("outer-line-doc-comments").adapter;

function checkOuterLineDocCommentsFixture(fixtureName) {
  const { source } = loadFixture("outer-line-doc-comments", fixtureName);

  return checkOuterLineDocComments({ adapter, source });
}

const outerLineDocPattern = /^\s*\/\/\/(?:\s|$)/;

function createMissingDocumentationCases(fixtureName) {
  const { source } = loadFixture("outer-line-doc-comments", fixtureName);
  const lines = source.split(/\r?\n/);
  const cases = [];
  let lineIndex = 0;

  while (lineIndex < lines.length) {
    if (!outerLineDocPattern.test(lines[lineIndex])) {
      lineIndex += 1;
      continue;
    }

    const groupStart = lineIndex;

    while (lineIndex < lines.length && outerLineDocPattern.test(lines[lineIndex])) {
      lineIndex += 1;
    }

    const groupEnd = lineIndex;

    assert.equal(
      groupEnd - groupStart,
      3,
      `${fixtureName}:${groupStart + 1} must contain a three-line outer line doc group`
    );

    const missingDocumentationLines = [...lines];

    missingDocumentationLines.fill("", groupStart, groupEnd);

    cases.push({
      fixtureName,
      lineNumber: groupStart + 1,
      source: missingDocumentationLines.join("\n"),
    });
  }

  assert.ok(cases.length > 0, `${fixtureName} must contain at least one outer line doc group`);

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
  "missing-trailing-line-comment-struct",
  "missing-trailing-multiline-block-comment-struct",
];
const invalidCommentCases = [
  {
    fixtureName: "invalid-inline-ordinary-block-comment-struct-field",
    errorPattern: /an ordinary block comment is not a valid outer line doc comment/,
  },
];

describe("Outer Line Doc Comments", () => {
  describe("documented targets", () => {
    for (const fixtureName of documentedTargetFixtureNames) {
      test(`accepts ${fixtureName}`, async () => {
        await assert.doesNotReject(() => checkOuterLineDocCommentsFixture(fixtureName));
      });
    }
  });

  describe("missing documentation", () => {
    for (const { fixtureName, lineNumber, source } of missingDocumentationCases) {
      test(`reports for ${fixtureName}:${lineNumber} without documentation`, async () => {
        await assert.rejects(
          () => checkOuterLineDocComments({ adapter, source }),
          /missing outer line doc comment/
        );
      });
    }

    for (const fixtureName of missingBoundaryFixtureNames) {
      test(`reports for ${fixtureName}`, async () => {
        await assert.rejects(
          () => checkOuterLineDocCommentsFixture(fixtureName),
          /missing outer line doc comment/
        );
      });
    }
  });

  describe("invalid comments", () => {
    for (const { fixtureName, errorPattern } of invalidCommentCases) {
      test(`reports for ${fixtureName}`, async () => {
        await assert.rejects(
          () => checkOuterLineDocCommentsFixture(fixtureName),
          errorPattern
        );
      });
    }
  });
});
