// dev/scripts/rust/comments/tests/source-file-header.test.mjs
import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { loadFixture, loadFixtureGroup } from "../fixtures/load.mjs";
import { checkSourceFileHeader } from "../rules/source-file-header.mjs";

function sourceFileHeaderInput({ fixtureRelativePath, source }) {
  return {
    repositoryRelativePath: fixtureRelativePath.replace(/\.template$/, ""),
    source,
  };
}

function loadSourceFileHeaderFixture(fixtureName) {
  return sourceFileHeaderInput(loadFixture("source-file-header", fixtureName));
}

function describeFixtureGroup(groupName, defineTests) {
  describe(groupName, () => {
    defineTests(loadFixtureGroup("source-file-header", groupName));
  });
}

function getFirstLine(source) {
  return source.split(/\r?\n/, 1)[0] ?? "";
}

function resolveInvalidFirstLineCase(caseName) {
  if (caseName === "missing-path") {
    return {
      repositoryRelativePath: "example.rs",
      source: "// ",
    };
  }

  return loadSourceFileHeaderFixture(caseName);
}

const missingFirstLineFixtureNames = ["empty-file", "non-comment-first-line"];

const missingHeaderFixtureNames = [
  "empty-first-line-without-valid-header",
  ...missingFirstLineFixtureNames,
];

const invalidHeaderMarkerFixtureNames = ["outer-line-doc-comment", "inner-doc-comment"];

const invalidSpacingFixtureNames = [
  "bare-comment-marker",
  "missing-space",
  "tab-instead-of-space",
  "missing-space-and-mismatched-path",
  "extra-space",
  "tab-after-space",
  "extra-space-and-mismatched-path",
];

const invalidSeparatorFixtureNames = ["backslash-path"];
const pathMismatchCaseNames = ["missing-path", "wrong-path"];

const invalidFirstLineCaseNames = [
  ...missingFirstLineFixtureNames,
  ...invalidHeaderMarkerFixtureNames,
  ...invalidSpacingFixtureNames,
  ...invalidSeparatorFixtureNames,
  ...pathMismatchCaseNames,
];

const misplacedHeaderLayouts = [
  {
    description: "on line 2",
    middleLines: [],
  },
  {
    description: "on line 4 after mixed content",
    middleLines: ["", "fn example() {}"],
  },
];

function deriveMisplacedCasesForFirstLine(caseName) {
  return misplacedHeaderLayouts.map(({ description, middleLines }) => ({
    caseName,
    description,
    middleLines,
  }));
}

const derivedMisplacedHeaderCases = invalidFirstLineCaseNames.flatMap(
  deriveMisplacedCasesForFirstLine
);

describe("Source File Header", () => {
  describeFixtureGroup("valid", ([fixture]) => {
    const { repositoryRelativePath, source } = sourceFileHeaderInput(fixture);

    test("accepts an LF first line header", () => {
      const lfSource = `${source.trimEnd()}\n`;

      assert.equal(checkSourceFileHeader(repositoryRelativePath, lfSource), null);
    });

    test("accepts a CRLF first line header", () => {
      const crlfSource = `${source.trimEnd()}\r\n`;

      assert.equal(checkSourceFileHeader(repositoryRelativePath, crlfSource), null);
    });
  });

  describe("header-not-first", () => {
    for (const { caseName, description, middleLines } of derivedMisplacedHeaderCases) {
      test(`reports ${description} for ${caseName}`, () => {
        const { repositoryRelativePath, source } = resolveInvalidFirstLineCase(caseName);
        const expected = `// ${repositoryRelativePath}`;
        const firstLine = getFirstLine(source);
        const generatedSource = [firstLine, ...middleLines, expected].join("\n");

        assert.notEqual(firstLine, expected, `${caseName} must have an invalid first line`);
        assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, generatedSource), {
          code: "header-not-first",
          expected,
          line: middleLines.length + 2,
        });
      });
    }
  });

  describe("missing-header", () => {
    for (const fixtureName of missingHeaderFixtureNames) {
      test(`reports for ${fixtureName}`, () => {
        const { repositoryRelativePath, source } = loadSourceFileHeaderFixture(fixtureName);

        assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
          code: "missing-header",
          expected: `// ${repositoryRelativePath}`,
        });
      });
    }
  });

  describe("invalid-header-marker", () => {
    for (const fixtureName of invalidHeaderMarkerFixtureNames) {
      test(`reports for ${fixtureName}`, () => {
        const { repositoryRelativePath, source } = loadSourceFileHeaderFixture(fixtureName);

        assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
          code: "invalid-header-marker",
          expected: `// ${repositoryRelativePath}`,
          actual: getFirstLine(source),
        });
      });
    }
  });

  describe("invalid-spacing", () => {
    for (const fixtureName of invalidSpacingFixtureNames) {
      test(`reports for ${fixtureName}`, () => {
        const { repositoryRelativePath, source } = loadSourceFileHeaderFixture(fixtureName);

        assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
          code: "invalid-spacing",
          expected: `// ${repositoryRelativePath}`,
          actual: getFirstLine(source),
        });
      });
    }
  });

  describe("invalid-separator", () => {
    for (const fixtureName of invalidSeparatorFixtureNames) {
      test(`reports for ${fixtureName}`, () => {
        const { repositoryRelativePath, source } = loadSourceFileHeaderFixture(fixtureName);

        assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
          code: "invalid-separator",
          expected: `// ${repositoryRelativePath}`,
          actual: getFirstLine(source),
        });
      });
    }
  });

  describe("path-mismatch", () => {
    for (const caseName of pathMismatchCaseNames) {
      test(`reports for ${caseName}`, () => {
        const { repositoryRelativePath, source } = resolveInvalidFirstLineCase(caseName);

        assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
          code: "path-mismatch",
          expected: `// ${repositoryRelativePath}`,
          actual: getFirstLine(source),
        });
      });
    }
  });
});
