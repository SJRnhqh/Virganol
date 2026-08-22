// dev/scripts/rust/comments/tests/source-file-header.test.mjs
import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { loadFixtureGroup } from "../fixtures/load.mjs";
import { checkSourceFileHeader } from "../rules/source-file-header.mjs";

const missingPathCase = {
  caseName: "missing-path",
  input: {
    repositoryRelativePath: "example.rs",
    source: "// ",
  },
};
const redundantHeaderNotFirstCaseNames = new Set(["empty-first-line-without-valid-header"]);
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

function sourceFileHeaderInput({ fixtureRelativePath, source }) {
  return {
    repositoryRelativePath: fixtureRelativePath.replace(/\.template$/, ""),
    source,
  };
}

function getFirstLine(source) {
  return source.split(/\r?\n/, 1)[0] ?? "";
}

function fixtureCase(fixture) {
  return {
    caseName: fixture.fixtureName,
    input: sourceFileHeaderInput(fixture),
  };
}

function fixtureErrorGroup(code, { additionalCases = [], expectsActual = true } = {}) {
  return {
    code,
    cases: [...loadFixtureGroup("source-file-header", code).map(fixtureCase), ...additionalCases],
    expectsActual,
  };
}

function deriveMisplacedCasesForFirstLine({ caseName, input }) {
  return misplacedHeaderLayouts.map(({ description, middleLines }) => ({
    caseName,
    input,
    description,
    middleLines,
  }));
}

const errorGroups = [
  fixtureErrorGroup("missing-header", { expectsActual: false }),
  fixtureErrorGroup("invalid-header-marker"),
  fixtureErrorGroup("invalid-spacing"),
  fixtureErrorGroup("invalid-separator"),
  fixtureErrorGroup("path-mismatch", { additionalCases: [missingPathCase] }),
];
const invalidFirstLineCases = errorGroups
  .flatMap(({ cases }) => cases)
  .filter(({ caseName }) => !redundantHeaderNotFirstCaseNames.has(caseName));
const derivedMisplacedHeaderCases = invalidFirstLineCases.flatMap(deriveMisplacedCasesForFirstLine);

describe("Source File Header", () => {
  describe("valid", () => {
    const [fixture] = loadFixtureGroup("source-file-header", "valid");
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
    for (const { caseName, input, description, middleLines } of derivedMisplacedHeaderCases) {
      test(`reports for ${caseName} ${description}`, () => {
        const { repositoryRelativePath, source } = input;
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

  for (const { code, cases, expectsActual } of errorGroups) {
    describe(code, () => {
      for (const { caseName, input } of cases) {
        test(`reports for ${caseName}`, () => {
          const { repositoryRelativePath, source } = input;
          const expectedError = {
            code,
            expected: `// ${repositoryRelativePath}`,
            ...(expectsActual ? { actual: getFirstLine(source) } : {}),
          };

          assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), expectedError);
        });
      }
    });
  }
});
