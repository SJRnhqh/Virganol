// dev/scripts/rust/comments/guards/source-file-header.guard.mjs
import { readFileSync } from "node:fs";
import path from "node:path";

import { checkSourceFileHeader } from "../rules/source-file-header.mjs";

export function runGuard({ repoRoot, rustFiles, config }) {
  const { tolerance } = config;
  const diagnostics = [];
  let checkedCount = 0;

  for (const relativePath of rustFiles) {
    const source = readFileSync(path.resolve(repoRoot, relativePath), "utf8");
    const diagnostic = checkSourceFileHeader(relativePath, source);

    checkedCount += 1;

    if (diagnostic) {
      diagnostics.push({ relativePath, line: diagnostic.line ?? 1, ...diagnostic });

      if (tolerance === "immediate") {
        break;
      }
    }
  }

  return { targetCount: rustFiles.length, checkedCount, diagnostics };
}
