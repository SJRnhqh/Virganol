// dev/scripts/rust/comments/audit.mjs
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadConfig } from "./config/load.mjs";
import { loadGuards } from "./guards/load.mjs";
import { reportGuardResult } from "./guards/report.mjs";
import { collectRustFiles } from "./files.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../../..");

async function main() {
  const rustFiles = collectRustFiles(repoRoot);
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
