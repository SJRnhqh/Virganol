// dev/scripts/rust/comments/files.mjs
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

export function collectRustFiles(repoRoot) {
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
  const rustFiles = output
    .split("\0")
    .filter(Boolean)
    .filter((relativePath) => existsSync(path.resolve(repoRoot, relativePath)))
    .sort();

  if (rustFiles.length === 0) {
    throw new Error("no Rust source files found");
  }

  return rustFiles;
}
