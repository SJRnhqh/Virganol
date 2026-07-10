// dev/scripts/rust/test.mjs
// Imports / 依赖导入
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Path setup / 路径设置
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");

// Resolve cargo path — husky may not have ~/.cargo/bin in PATH
// 解析 cargo 路径 — husky 环境可能未将 ~/.cargo/bin 加入 PATH
const cargoPath = (() => {
  const home = process.env.HOME ?? process.env.USERPROFILE ?? "";
  if (home) {
    const guessed = path.join(home, ".cargo/bin/cargo");
    if (fs.existsSync(guessed)) return guessed;
  }
  return "cargo";
})();

// Timeout budget / 超时预算
const DEFAULT_STEP_TIMEOUT_MS = 120_000;
const RUST_BUILD_STEP_TIMEOUT_MS = 300_000;

// Quality gates / 质量门
const steps = [
  {
    name: "lint:source-headers",
    command: "node",
    args: [path.resolve(scriptDir, "lint-source-headers.mjs")],
  },
  {
    name: "lint:item-doc-comments",
    command: "node",
    args: [path.resolve(scriptDir, "lint-item-doc-comments.mjs")],
  },
  {
    name: "contract:reexport-visibility",
    command: "node",
    args: [path.resolve(scriptDir, "contract-reexport-visibility.mjs")],
  },
  {
    name: "sidecar",
    command: "node",
    args: [path.resolve(repoRoot, "apps/desktop/scripts/build-sidecar.js")],
    timeoutMs: RUST_BUILD_STEP_TIMEOUT_MS,
  },
  {
    name: "check",
    command: cargoPath,
    args: ["check"],
    timeoutMs: RUST_BUILD_STEP_TIMEOUT_MS,
  },
  {
    name: "test",
    command: cargoPath,
    args: ["test"],
    timeoutMs: RUST_BUILD_STEP_TIMEOUT_MS,
  },
];

let failed = 0;

for (const step of steps) {
  try {
    execFileSync(step.command, step.args, {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: "inherit",
      timeout: step.timeoutMs ?? DEFAULT_STEP_TIMEOUT_MS,
    });
  } catch {
    failed += 1;
  }
}

if (failed > 0) {
  console.error(`\n❌ ${failed} step(s) failed`);
  process.exit(1);
}
