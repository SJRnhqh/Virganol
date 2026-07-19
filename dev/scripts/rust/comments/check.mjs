// dev/scripts/rust/comments/check.mjs
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { checkSourceFileHeader } from "./rules/source-file-header.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../../..");

function collectRustFiles() {
  const output = execFileSync(
    "git",
    [
      "ls-files",
      "--cached",
      "--others",
      "--exclude-standard",
      "-z",
      "--",
      "*.rs",
    ],
    {
      cwd: repoRoot,
      encoding: "utf8",
    },
  );

  const rustFiles = output.split("\0").filter(Boolean).sort();

  if (rustFiles.length === 0) {
    throw new Error("no Rust source files found");
  }

  return rustFiles;
}

let rustFiles;
let failures;

try {
  rustFiles = collectRustFiles();
  failures = rustFiles.flatMap((relativePath) => {
    const source = readFileSync(path.resolve(repoRoot, relativePath), "utf8");
    const diagnostic = checkSourceFileHeader(relativePath, source);

    return diagnostic ? [{ relativePath, ...diagnostic }] : [];
  });
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);

  console.error(`rust comments check failed: ${message}`);
  process.exit(1);
}

if (failures.length > 0) {
  console.error(`rust comments check failed (${failures.length} failure(s))\n`);
  console.error("rule: source-file-header\n");

  for (const failure of failures) {
    console.error(`location: ${failure.relativePath}:${failure.line ?? 1}`);
    console.error(`code:     ${failure.code}`);
    console.error(`expected: ${failure.expected}`);

    if ("actual" in failure) {
      console.error(`actual:   ${failure.actual || "<empty>"}`);
    }

    console.error("");
  }

  process.exit(1);
}

console.log(`rust comments check passed (${rustFiles.length} files)`);
