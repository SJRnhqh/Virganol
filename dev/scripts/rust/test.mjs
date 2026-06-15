// dev/scripts/rust/test.mjs
// Imports / 依赖导入
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Path setup / 路径设置
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");

// Quality gates / 质量门
const steps = [
  { name: "lint", command: "node", args: [path.resolve(scriptDir, "lint-source-headers.mjs")] },
  { name: "test", command: "cargo", args: ["test"] },
];

let failed = 0;

for (const step of steps) {
  try {
    execFileSync(step.command, step.args, {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: "inherit",
      timeout: 120_000,
    });
  } catch {
    failed += 1;
  }
}

if (failed > 0) {
  console.error(`\n❌ ${failed} step(s) failed`);
  process.exit(1);
}
