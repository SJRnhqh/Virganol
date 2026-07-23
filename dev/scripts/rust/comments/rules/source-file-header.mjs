// dev/scripts/rust/comments/rules/source-file-header.mjs
export function checkSourceFileHeader(repositoryRelativePath, source) {
  const expected = `// ${repositoryRelativePath}`;
  const lines = source.split(/\r?\n/);
  const actual = lines[0] ?? "";

  if (actual === expected) {
    return null;
  }

  const headerIndex = lines.indexOf(expected, 1);

  if (headerIndex !== -1) {
    return {
      code: "header-not-first",
      expected,
      line: headerIndex + 1,
    };
  }

  if (!actual.startsWith("//")) {
    return {
      code: "missing-header",
      expected,
    };
  }

  if (actual.startsWith("///") || actual.startsWith("//!")) {
    return {
      code: "invalid-header-marker",
      expected,
      actual,
    };
  }

  if (actual[2] !== " " || /^\s/.test(actual.slice(3))) {
    return {
      code: "invalid-spacing",
      expected,
      actual,
    };
  }

  if (actual.includes("\\")) {
    return {
      code: "invalid-separator",
      expected,
      actual,
    };
  }

  return {
    code: "path-mismatch",
    expected,
    actual,
  };
}
