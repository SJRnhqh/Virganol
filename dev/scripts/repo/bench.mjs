// dev/scripts/repo/bench.mjs
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");

const suites = [
  {
    name: "Rust",
    script: path.resolve(scriptDir, "../rust/bench.mjs"),
  },
];

const separator = "═".repeat(60);

console.log("virganol bench");

let completed = 0;
let failed = 0;

for (const suite of suites) {
  console.log(`\n${separator}`);
  console.log(`  ${suite.name}`);
  console.log(separator);

  const result = spawnSync(process.execPath, [suite.script], {
    cwd: repoRoot,
    stdio: "inherit",
  });

  if (result.status === 0) {
    completed += 1;
  } else {
    if (result.error) {
      console.error(`benchmark suite failed: ${suite.name}: ${result.error.message}`);
    }

    failed += 1;
  }
}

console.log(`\n${separator}`);
console.log(`completed: ${completed}  failed: ${failed}`);
console.log(separator);

process.exit(failed > 0 ? 1 : 0);
