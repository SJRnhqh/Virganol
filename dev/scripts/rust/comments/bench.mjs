// dev/scripts/rust/comments/bench.mjs
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../../..");
const benchmarkDir = path.resolve(scriptDir, "benchmarks");

const benchmarks = readdirSync(benchmarkDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".bench.mjs"))
  .map((entry) => path.resolve(benchmarkDir, entry.name))
  .sort();

console.log("rust comments bench");

if (benchmarks.length === 0) {
  console.log("rust comments bench: no benchmarks configured");
  process.exit(0);
}

let completed = 0;
let failed = 0;

for (const benchmark of benchmarks) {
  const result = spawnSync(process.execPath, [benchmark], {
    cwd: repoRoot,
    stdio: "inherit",
  });

  if (result.status === 0) {
    completed += 1;
  } else {
    if (result.error) {
      console.error(`benchmark failed: ${path.basename(benchmark)}: ${result.error.message}`);
    }

    failed += 1;
  }
}

console.log(`rust comments bench completed: ${completed}  failed: ${failed}`);

process.exit(failed > 0 ? 1 : 0);
