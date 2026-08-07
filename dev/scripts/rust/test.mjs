// dev/scripts/rust/test.mjs
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");

const cargoPath = (() => {
  const home = process.env.HOME ?? process.env.USERPROFILE ?? "";
  if (home) {
    const guessed = path.join(home, ".cargo/bin/cargo");
    if (existsSync(guessed)) return guessed;
  }
  return "cargo";
})();

const DEFAULT_STEP_TIMEOUT_MS = 120_000;
const RUST_BUILD_STEP_TIMEOUT_MS = 300_000;

const steps = [
  {
    command: "node",
    args: [path.resolve(scriptDir, "comments/check.mjs")],
  },
  {
    command: "node",
    args: [path.resolve(scriptDir, "lint-item-doc-comments.mjs")],
  },
  {
    command: "node",
    args: [path.resolve(scriptDir, "contract-reexport-visibility.mjs")],
  },
  {
    command: "node",
    args: [path.resolve(repoRoot, "apps/desktop/scripts/build-sidecar.js")],
    timeoutMs: RUST_BUILD_STEP_TIMEOUT_MS,
  },
  {
    command: cargoPath,
    args: ["check"],
    timeoutMs: RUST_BUILD_STEP_TIMEOUT_MS,
  },
  {
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
