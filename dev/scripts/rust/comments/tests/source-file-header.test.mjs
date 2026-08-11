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

function sourceFileHeaderFixtureGroup(groupName) {
  return {
    groupName,
    fixtures: loadFixtureGroup("source-file-header", groupName),
  };
}

function describeFixtureGroup({ groupName, fixtures }, defineTests) {
  describe(groupName, () => {
    defineTests(fixtures);
  });
}

function getFirstLine(source) {
  return source.split(/\r?\n/, 1)[0] ?? "";
}

const validFixtureGroup = sourceFileHeaderFixtureGroup("valid");
const invalidHeaderMarkerFixtureGroup = sourceFileHeaderFixtureGroup("invalid-header-marker");
const invalidSeparatorFixtureGroup = sourceFileHeaderFixtureGroup("invalid-separator");
const invalidSpacingFixtureGroup = sourceFileHeaderFixtureGroup("invalid-spacing");
const missingHeaderFixtureGroup = sourceFileHeaderFixtureGroup("missing-header");
const pathMismatchFixtureGroup = sourceFileHeaderFixtureGroup("path-mismatch");
const redundantMisplacedHeaderFixtureNames = new Set(["empty-first-line-without-valid-header"]);
const groupedInvalidFirstLineFixtures = [
  ...missingHeaderFixtureGroup.fixtures.filter(
    ({ fixtureName }) => !redundantMisplacedHeaderFixtureNames.has(fixtureName)
  ),
  ...[
    invalidHeaderMarkerFixtureGroup,
    invalidSeparatorFixtureGroup,
    invalidSpacingFixtureGroup,
    pathMismatchFixtureGroup,
  ].flatMap(({ fixtures }) => fixtures),
];
const groupedInvalidFirstLineFixturesByName = new Map(
  groupedInvalidFirstLineFixtures.map((fixture) => [fixture.fixtureName, fixture])
);
const missingPathCaseName = "missing-path";

function resolveInvalidFirstLineCase(caseName) {
  if (caseName === missingPathCaseName) {
    return {
      repositoryRelativePath: "example.rs",
      source: "// ",
    };
  }

  const groupedFixture = groupedInvalidFirstLineFixturesByName.get(caseName);

  return groupedFixture
    ? sourceFileHeaderInput(groupedFixture)
    : loadSourceFileHeaderFixture(caseName);
}

const invalidFirstLineCaseNames = [
  ...groupedInvalidFirstLineFixtures.map(({ fixtureName }) => fixtureName),
  missingPathCaseName,
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
  describeFixtureGroup(validFixtureGroup, ([fixture]) => {
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

  describeFixtureGroup(missingHeaderFixtureGroup, (fixtures) => {
    for (const fixture of fixtures) {
      test(`reports for ${fixture.fixtureName}`, () => {
        const { repositoryRelativePath, source } = sourceFileHeaderInput(fixture);

        assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
          code: "missing-header",
          expected: `// ${repositoryRelativePath}`,
        });
      });
    }
  });

  describeFixtureGroup(invalidHeaderMarkerFixtureGroup, (fixtures) => {
    for (const fixture of fixtures) {
      test(`reports for ${fixture.fixtureName}`, () => {
        const { repositoryRelativePath, source } = sourceFileHeaderInput(fixture);

        assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
          code: "invalid-header-marker",
          expected: `// ${repositoryRelativePath}`,
          actual: getFirstLine(source),
        });
      });
    }
  });

  describeFixtureGroup(invalidSpacingFixtureGroup, (fixtures) => {
    for (const fixture of fixtures) {
      test(`reports for ${fixture.fixtureName}`, () => {
        const { repositoryRelativePath, source } = sourceFileHeaderInput(fixture);

        assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
          code: "invalid-spacing",
          expected: `// ${repositoryRelativePath}`,
          actual: getFirstLine(source),
        });
      });
    }
  });

  describeFixtureGroup(invalidSeparatorFixtureGroup, (fixtures) => {
    for (const fixture of fixtures) {
      test(`reports for ${fixture.fixtureName}`, () => {
        const { repositoryRelativePath, source } = sourceFileHeaderInput(fixture);

        assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
          code: "invalid-separator",
          expected: `// ${repositoryRelativePath}`,
          actual: getFirstLine(source),
        });
      });
    }
  });

  describeFixtureGroup(pathMismatchFixtureGroup, ([fixture]) => {
    test(`reports for ${fixture.fixtureName}`, () => {
      const { repositoryRelativePath, source } = sourceFileHeaderInput(fixture);

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "path-mismatch",
        expected: `// ${repositoryRelativePath}`,
        actual: getFirstLine(source),
      });
    });

    test(`reports for ${missingPathCaseName}`, () => {
      const { repositoryRelativePath, source } = resolveInvalidFirstLineCase(missingPathCaseName);

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "path-mismatch",
        expected: `// ${repositoryRelativePath}`,
        actual: getFirstLine(source),
      });
    });
  });
});
