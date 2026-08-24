// dev/scripts/rust/comments/tests/files.test.mjs
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

import { collectRustFiles } from "../files.mjs";

test("collects the worktree side of an unstaged Rust file move", () => {
  const repoRoot = mkdtempSync(path.join(os.tmpdir(), "virganol-rust-comments-files-"));

  try {
    const oldPath = path.join(repoRoot, "old.rs");
    const newDirectory = path.join(repoRoot, "nested");

    execFileSync("git", ["init", "--quiet"], { cwd: repoRoot });
    writeFileSync(oldPath, "// old.rs\n");
    execFileSync("git", ["add", "old.rs"], { cwd: repoRoot });

    rmSync(oldPath);
    mkdirSync(newDirectory);
    writeFileSync(path.join(newDirectory, "new.rs"), "// nested/new.rs\n");

    assert.deepEqual(collectRustFiles(repoRoot), ["nested/new.rs"]);
  } finally {
    rmSync(repoRoot, { recursive: true, force: true });
  }
});
