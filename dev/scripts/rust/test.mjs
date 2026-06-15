// dev/scripts/rust/test.mjs
// Imports / 依赖导入
import { execFileSync, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Path setup / 路径设置
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");

// Quality gates / 质量门
const steps = [
  {
    name: "lint",
    command: "node",
    args: [path.resolve(scriptDir, "lint-source-headers.mjs")],
  },
  {
    name: "test",
    command: "cargo",
    args: ["test"],
  },
];

// Execution / 执行
console.log("Rust (desktop)");
console.log("─".repeat(60));

let passed = 0;
let failed = 0;

for (const step of steps) {
  try {
    execFileSync(step.command, step.args, {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: "inherit",
      timeout: 120_000,
    });
    passed += 1;
  } catch {
    failed += 1;
  }
}

// Result / 结果
console.log("");
if (failed === 0) {
  console.log("✅ Rust (desktop) passed");
} else {
  console.error(`❌ Rust (desktop) failed (${failed} step(s) failed)`);
  process.exit(1);
}
