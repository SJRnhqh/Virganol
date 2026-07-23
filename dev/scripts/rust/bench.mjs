// dev/scripts/rust/bench.mjs
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");

const suites = [
  {
    name: "Comments",
    script: path.resolve(scriptDir, "comments/bench.mjs"),
  },
];

console.log("rust bench");

let completed = 0;
let failed = 0;

for (const suite of suites) {
  console.log(`\nrust bench: ${suite.name}`);

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

if (suites.length === 0) {
  console.log("rust bench: no benchmark suites configured");
} else {
  console.log(`rust bench completed: ${completed}  failed: ${failed}`);
}

process.exit(failed > 0 ? 1 : 0);
