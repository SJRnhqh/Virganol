// dev/scripts/rust/comments/audit.mjs
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadConfig } from "./config/load.mjs";
import { loadGuards } from "./guards/load.mjs";
import { reportGuardResult } from "./guards/report.mjs";

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

async function main() {
  const rustFiles = collectRustFiles();
  let failed = false;

  for (const { guardName, runGuard } of await loadGuards()) {
    const config = loadConfig(guardName);
    const result = await runGuard({ repoRoot, rustFiles, config });
    reportGuardResult({ guardName, config, ...result });

    if (result.diagnostics.length > 0) {
      failed = true;
    }
  }

  if (failed) {
    process.exitCode = 1;
  }
}

try {
  await main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);

  console.error(`rust comments audit failed: ${message}`);
  process.exitCode = 1;
}
