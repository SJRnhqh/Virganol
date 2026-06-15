// dev/scripts/repo/test.mjs
// Imports / 依赖导入
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Path setup / 路径设置
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");

// Suite routing / 测试套件路由
const suites = [
  {
    name: "Rust (desktop)",
    script: path.resolve(scriptDir, "../rust/test.mjs"),
  },
  // TODO: Go (server)   — dev/scripts/go/test.mjs
  {
    name: "TS (ui)",
    script: path.resolve(scriptDir, "../ts/test.mjs"),
  },
];

// Test execution / 测试执行
console.log("virganol test\n");

let passed = 0;
let failed = 0;

for (const suite of suites) {
  const result = spawnSync("node", [suite.script], {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: "inherit",
    timeout: 180_000,
  });

  if (result.status === 0) {
    passed += 1;
  } else {
    failed += 1;
  }
}

// Summary / 汇总
console.log("\n" + "═".repeat(60));
console.log(`passed: ${passed}  failed: ${failed}`);
console.log("═".repeat(60));

process.exit(failed > 0 ? 1 : 0);
