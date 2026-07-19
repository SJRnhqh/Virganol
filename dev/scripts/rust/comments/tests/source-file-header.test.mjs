// dev/scripts/rust/comments/tests/source-file-header.test.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, test } from "node:test";
import { fileURLToPath } from "node:url";

import { checkSourceFileHeader } from "../rules/source-file-header.mjs";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(testDir, "../../../../..");
const fixtureDir = path.resolve(testDir, "../fixtures/source-file-header");

function loadFixture(name) {
  const fixturePath = path.resolve(fixtureDir, `${name}.rs.template`);
  const repositoryRelativePath = path
    .relative(repoRoot, fixturePath)
    .split(path.sep)
    .join("/")
    .replace(/\.template$/, "");

  return {
    repositoryRelativePath,
    source: readFileSync(fixturePath, "utf8"),
  };
}

function loadInvalidFirstLineCase(name) {
  if (name === "missing-path") {
    return {
      repositoryRelativePath: "example.rs",
      source: "// ",
    };
  }

  return loadFixture(name);
}

const invalidFirstLineCases = [
  "empty-file",
  "non-comment-first-line",
  "module-documentation",
  "item-documentation",
  "bare-comment-marker",
  "missing-space",
  "tab-instead-of-space",
  "missing-space-and-mismatched-path",
  "extra-space",
  "tab-after-space",
  "extra-space-and-mismatched-path",
  "backslash-path",
  "missing-path",
  "wrong-path",
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

describe("Source File Header", () => {
  describe("valid-header", () => {
    test("accepts an LF first-line header", () => {
      const { repositoryRelativePath, source } = loadFixture("valid");
      const lfSource = `${source.trimEnd()}\n`;

      assert.equal(checkSourceFileHeader(repositoryRelativePath, lfSource), null);
    });

    test("accepts a CRLF first-line header", () => {
      const { repositoryRelativePath, source } = loadFixture("valid");
      const crlfSource = `${source.trimEnd()}\r\n`;

      assert.equal(checkSourceFileHeader(repositoryRelativePath, crlfSource), null);
    });
  });

  describe("header-not-first", () => {
    for (const caseName of invalidFirstLineCases) {
      for (const { description, middleLines } of misplacedHeaderLayouts) {
        test(`reports ${description} for ${caseName}`, () => {
          const { repositoryRelativePath, source } =
            loadInvalidFirstLineCase(caseName);
          const expected = `// ${repositoryRelativePath}`;
          const firstLine = source.split(/\r?\n/, 1)[0] ?? "";
          const generatedSource = [
            firstLine,
            ...middleLines,
            expected,
          ].join("\n");

          assert.notEqual(
            firstLine,
            expected,
            `${caseName} must have an invalid first line`,
          );
          assert.deepEqual(
            checkSourceFileHeader(repositoryRelativePath, generatedSource),
            {
              code: "header-not-first",
              expected,
              line: middleLines.length + 2,
            },
          );
        });
      }
    }
  });

  describe("missing-header", () => {
    test("reports when an empty first line has no later valid header", () => {
      const { repositoryRelativePath, source } = loadFixture(
        "empty-first-line-without-valid-header",
      );

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "missing-header",
        expected: `// ${repositoryRelativePath}`,
      });
    });

    test("reports for an empty file", () => {
      const { repositoryRelativePath, source } = loadFixture("empty-file");

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "missing-header",
        expected: `// ${repositoryRelativePath}`,
      });
    });

    test("reports for a non-comment first line", () => {
      const { repositoryRelativePath, source } = loadFixture(
        "non-comment-first-line",
      );

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "missing-header",
        expected: `// ${repositoryRelativePath}`,
      });
    });
  });

  describe("invalid-header-marker", () => {
    test("reports for module documentation", () => {
      const { repositoryRelativePath, source } = loadFixture(
        "module-documentation",
      );

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "invalid-header-marker",
        expected: `// ${repositoryRelativePath}`,
        actual: source.trimEnd(),
      });
    });

    test("reports for item documentation", () => {
      const { repositoryRelativePath, source } = loadFixture(
        "item-documentation",
      );

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "invalid-header-marker",
        expected: `// ${repositoryRelativePath}`,
        actual: source.trimEnd(),
      });
    });
  });

  describe("invalid-spacing", () => {
    test("reports for a bare comment marker", () => {
      const { repositoryRelativePath, source } = loadFixture(
        "bare-comment-marker",
      );

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "invalid-spacing",
        expected: `// ${repositoryRelativePath}`,
        actual: source.trimEnd(),
      });
    });

    test("reports for a missing space", () => {
      const { repositoryRelativePath, source } = loadFixture("missing-space");

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "invalid-spacing",
        expected: `// ${repositoryRelativePath}`,
        actual: source.trimEnd(),
      });
    });

    test("reports for a tab instead of the required space", () => {
      const { repositoryRelativePath, source } = loadFixture(
        "tab-instead-of-space",
      );

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "invalid-spacing",
        expected: `// ${repositoryRelativePath}`,
        actual: source.trimEnd(),
      });
    });

    test("reports for a missing space with a mismatched path", () => {
      const { repositoryRelativePath, source } = loadFixture(
        "missing-space-and-mismatched-path",
      );

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "invalid-spacing",
        expected: `// ${repositoryRelativePath}`,
        actual: source.trimEnd(),
      });
    });

    test("reports for an extra space", () => {
      const { repositoryRelativePath, source } = loadFixture("extra-space");

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "invalid-spacing",
        expected: `// ${repositoryRelativePath}`,
        actual: source.trimEnd(),
      });
    });

    test("reports for a tab after the required space", () => {
      const { repositoryRelativePath, source } = loadFixture("tab-after-space");

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "invalid-spacing",
        expected: `// ${repositoryRelativePath}`,
        actual: source.trimEnd(),
      });
    });

    test("reports for an extra space with a mismatched path", () => {
      const { repositoryRelativePath, source } = loadFixture(
        "extra-space-and-mismatched-path",
      );

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "invalid-spacing",
        expected: `// ${repositoryRelativePath}`,
        actual: source.trimEnd(),
      });
    });
  });

  test("reports invalid-separator for a backslash path separator", () => {
    const { repositoryRelativePath, source } = loadFixture("backslash-path");

    assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
      code: "invalid-separator",
      expected: `// ${repositoryRelativePath}`,
      actual: source.trimEnd(),
    });
  });

  describe("path-mismatch", () => {
    test("reports for a missing repository path", () => {
      const { repositoryRelativePath, source } =
        loadInvalidFirstLineCase("missing-path");

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "path-mismatch",
        expected: `// ${repositoryRelativePath}`,
        actual: source,
      });
    });

    test("reports for an incorrect repository path", () => {
      const { repositoryRelativePath, source } = loadFixture("wrong-path");

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "path-mismatch",
        expected: `// ${repositoryRelativePath}`,
        actual: source.trimEnd(),
      });
    });
  });
});
