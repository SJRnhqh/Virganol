// dev/scripts/rust/comments/tests/source-file-header.test.mjs
import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { loadFixture } from "../fixtures/load.mjs";
import { checkSourceFileHeader } from "../rules/source-file-header.mjs";

function loadSourceFileHeaderFixture(name) {
  const { fixtureRelativePath, source } = loadFixture("source-file-header", name);

  return {
    repositoryRelativePath: fixtureRelativePath.replace(/\.template$/, ""),
    source,
  };
}

function loadInvalidFirstLineCase(name) {
  if (name === "missing-path") {
    return {
      repositoryRelativePath: "example.rs",
      source: "// ",
    };
  }

  return loadSourceFileHeaderFixture(name);
}

const invalidFirstLineCases = [
  "empty-file",
  "non-comment-first-line",
  "inner-doc-comment",
  "outer-doc-comment",
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
      const { repositoryRelativePath, source } = loadSourceFileHeaderFixture("valid");
      const lfSource = `${source.trimEnd()}\n`;

      assert.equal(checkSourceFileHeader(repositoryRelativePath, lfSource), null);
    });

    test("accepts a CRLF first-line header", () => {
      const { repositoryRelativePath, source } = loadSourceFileHeaderFixture("valid");
      const crlfSource = `${source.trimEnd()}\r\n`;

      assert.equal(checkSourceFileHeader(repositoryRelativePath, crlfSource), null);
    });
  });

  describe("header-not-first", () => {
    for (const caseName of invalidFirstLineCases) {
      for (const { description, middleLines } of misplacedHeaderLayouts) {
        test(`reports ${description} for ${caseName}`, () => {
          const { repositoryRelativePath, source } = loadInvalidFirstLineCase(caseName);
          const expected = `// ${repositoryRelativePath}`;
          const firstLine = source.split(/\r?\n/, 1)[0] ?? "";
          const generatedSource = [firstLine, ...middleLines, expected].join("\n");

          assert.notEqual(firstLine, expected, `${caseName} must have an invalid first line`);
          assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, generatedSource), {
            code: "header-not-first",
            expected,
            line: middleLines.length + 2,
          });
        });
      }
    }
  });

  describe("missing-header", () => {
    test("reports when an empty first line has no later valid header", () => {
      const { repositoryRelativePath, source } = loadSourceFileHeaderFixture(
        "empty-first-line-without-valid-header"
      );

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "missing-header",
        expected: `// ${repositoryRelativePath}`,
      });
    });

    test("reports for an empty file", () => {
      const { repositoryRelativePath, source } = loadSourceFileHeaderFixture("empty-file");

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "missing-header",
        expected: `// ${repositoryRelativePath}`,
      });
    });

    test("reports for a non-comment first line", () => {
      const { repositoryRelativePath, source } =
        loadSourceFileHeaderFixture("non-comment-first-line");

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "missing-header",
        expected: `// ${repositoryRelativePath}`,
      });
    });
  });

  describe("invalid-header-marker", () => {
    test("reports for an inner doc comment", () => {
      const { repositoryRelativePath, source } = loadSourceFileHeaderFixture("inner-doc-comment");

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "invalid-header-marker",
        expected: `// ${repositoryRelativePath}`,
        actual: source.trimEnd(),
      });
    });

    test("reports for an outer doc comment", () => {
      const { repositoryRelativePath, source } = loadSourceFileHeaderFixture("outer-doc-comment");

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "invalid-header-marker",
        expected: `// ${repositoryRelativePath}`,
        actual: source.trimEnd(),
      });
    });
  });

  describe("invalid-spacing", () => {
    test("reports for a bare comment marker", () => {
      const { repositoryRelativePath, source } = loadSourceFileHeaderFixture("bare-comment-marker");

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "invalid-spacing",
        expected: `// ${repositoryRelativePath}`,
        actual: source.trimEnd(),
      });
    });

    test("reports for a missing space", () => {
      const { repositoryRelativePath, source } = loadSourceFileHeaderFixture("missing-space");

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "invalid-spacing",
        expected: `// ${repositoryRelativePath}`,
        actual: source.trimEnd(),
      });
    });

    test("reports for a tab instead of the required space", () => {
      const { repositoryRelativePath, source } =
        loadSourceFileHeaderFixture("tab-instead-of-space");

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "invalid-spacing",
        expected: `// ${repositoryRelativePath}`,
        actual: source.trimEnd(),
      });
    });

    test("reports for a missing space with a mismatched path", () => {
      const { repositoryRelativePath, source } = loadSourceFileHeaderFixture(
        "missing-space-and-mismatched-path"
      );

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "invalid-spacing",
        expected: `// ${repositoryRelativePath}`,
        actual: source.trimEnd(),
      });
    });

    test("reports for an extra space", () => {
      const { repositoryRelativePath, source } = loadSourceFileHeaderFixture("extra-space");

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "invalid-spacing",
        expected: `// ${repositoryRelativePath}`,
        actual: source.trimEnd(),
      });
    });

    test("reports for a tab after the required space", () => {
      const { repositoryRelativePath, source } = loadSourceFileHeaderFixture("tab-after-space");

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "invalid-spacing",
        expected: `// ${repositoryRelativePath}`,
        actual: source.trimEnd(),
      });
    });

    test("reports for an extra space with a mismatched path", () => {
      const { repositoryRelativePath, source } = loadSourceFileHeaderFixture(
        "extra-space-and-mismatched-path"
      );

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "invalid-spacing",
        expected: `// ${repositoryRelativePath}`,
        actual: source.trimEnd(),
      });
    });
  });

  test("reports invalid-separator for a backslash path separator", () => {
    const { repositoryRelativePath, source } = loadSourceFileHeaderFixture("backslash-path");

    assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
      code: "invalid-separator",
      expected: `// ${repositoryRelativePath}`,
      actual: source.trimEnd(),
    });
  });

  describe("path-mismatch", () => {
    test("reports for a missing repository path", () => {
      const { repositoryRelativePath, source } = loadInvalidFirstLineCase("missing-path");

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "path-mismatch",
        expected: `// ${repositoryRelativePath}`,
        actual: source,
      });
    });

    test("reports for an incorrect repository path", () => {
      const { repositoryRelativePath, source } = loadSourceFileHeaderFixture("wrong-path");

      assert.deepEqual(checkSourceFileHeader(repositoryRelativePath, source), {
        code: "path-mismatch",
        expected: `// ${repositoryRelativePath}`,
        actual: source.trimEnd(),
      });
    });
  });
});
