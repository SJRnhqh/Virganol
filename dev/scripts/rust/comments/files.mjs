// dev/scripts/rust/comments/files.mjs
import { execFileSync } from "node:child_process";

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
  const rustFiles = output.split("\0").filter(Boolean).sort();

  if (rustFiles.length === 0) {
    throw new Error("no Rust source files found");
  }

  return rustFiles;
}
