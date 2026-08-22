// dev/scripts/rust/comments/check.mjs
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../../..");

const steps = [
  {
    name: "rule conformance tests",
    script: path.resolve(scriptDir, "test.mjs"),
  },
  {
    name: "repository audit",
    script: path.resolve(scriptDir, "audit.mjs"),
  },
];

for (const step of steps) {
  console.log(`\nrust comments check: ${step.name}`);

  const result = spawnSync(process.execPath, [step.script], {
    cwd: repoRoot,
    stdio: "inherit",
    timeout: 120_000,
  });

  if (result.status !== 0) {
    const detail = result.error ? `: ${result.error.message}` : "";

    console.error(`rust comments check failed: ${step.name}${detail}`);
    process.exit(1);
  }
}

console.log("\nrust comments check passed");
