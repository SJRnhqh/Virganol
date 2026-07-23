// dev/scripts/rust/comments/test.mjs
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { prepareAdapterEnvironment } from "./build/environment.mjs";
import { loadConfig } from "./config/load.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../../..");
const testDir = path.resolve(scriptDir, "tests");

const ruleTests = readdirSync(testDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".test.mjs"))
  .map((entry) => path.resolve(testDir, entry.name))
  .sort();

if (ruleTests.length === 0) {
  console.error("rust comments test failed: no rule tests found");
  process.exit(1);
}

let testEnvironment;

try {
  const { adapter } = loadConfig("outer-doc-comments");

  testEnvironment = await prepareAdapterEnvironment({ adapter, profile: "debug" });
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);

  console.error(`rust comments test failed: environment preparation: ${message}`);
  process.exit(1);
}

const steps = [
  {
    name: "rule tests",
    args: ["--test", ...ruleTests],
  },
  {
    name: "repository check",
    args: [path.resolve(scriptDir, "check.mjs")],
  },
];

for (const step of steps) {
  console.log(`\nrust comments: ${step.name}`);

  const result = spawnSync(process.execPath, step.args, {
    cwd: repoRoot,
    env: testEnvironment,
    stdio: "inherit",
    timeout: 120_000,
  });

  if (result.status !== 0) {
    const detail = result.error ? `: ${result.error.message}` : "";

    console.error(`rust comments test failed: ${step.name}${detail}`);
    process.exit(1);
  }
}

console.log("\nrust comments test passed");
