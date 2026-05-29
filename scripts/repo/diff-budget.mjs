// scripts/repo/diff-budget.mjs
// Imports / 依赖导入
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Path setup / 路径设置
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");

// Review budget setup / 审查预算设置
const WARN_LIMIT = 100_000;
const DANGER_LIMIT = 130_000;
const HARD_LIMIT = 150_000;
const MAX_BUFFER = 64 * 1024 * 1024;

const args = process.argv.slice(2).filter((arg) => arg !== "--");
const explicitBase = args[0];

// Git helpers / Git 调用封装
function git(args) {
  return execFileSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: MAX_BUFFER,
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function tryGit(args) {
  try {
    return git(args);
  } catch {
    return null;
  }
}

function refExists(ref) {
  return tryGit(["rev-parse", "--verify", `${ref}^{commit}`]) !== null;
}

// Base detection / 基线推断
function inferWorkingBranchBase(branch) {
  if (!branch.startsWith("feat/")) {
    return null;
  }

  const branchName = branch.slice("feat/".length);
  const taskSeparator = branchName.indexOf("-");

  if (taskSeparator <= 0) {
    return null;
  }

  const localFeatureBase = `feat/${branchName.slice(0, taskSeparator)}`;
  const remoteFeatureBase = `origin/${localFeatureBase}`;

  if (refExists(localFeatureBase)) {
    return localFeatureBase;
  }

  if (refExists(remoteFeatureBase)) {
    return remoteFeatureBase;
  }

  return null;
}

function inferBase() {
  const branch = git(["branch", "--show-current"]);
  const workingBranchBase = inferWorkingBranchBase(branch);

  if (workingBranchBase) {
    return {
      base: workingBranchBase,
      source: `inferred from branch ${branch}`,
    };
  }

  const upstream = tryGit(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"]);

  if (upstream) {
    return {
      base: upstream,
      source: "current branch upstream",
    };
  }

  throw new Error(
    "could not infer diff base; pass one explicitly, e.g. pnpm diff:budget -- feat/spirit"
  );
}

// Budget calculation / 预算计算
function statusFor(charCount) {
  if (charCount >= HARD_LIMIT) {
    return "over limit";
  }

  if (charCount >= DANGER_LIMIT) {
    return "danger";
  }

  if (charCount >= WARN_LIMIT) {
    return "warning";
  }

  return "ok";
}

function measureDiff(label, ref) {
  const diffArgs = ["diff", "--no-ext-diff", "--no-color", ref];
  const statArgs = ["diff", "--shortstat", "--no-ext-diff", "--no-color", ref];
  const diff = git(diffArgs);

  return {
    label,
    chars: diff.length,
    percent: `${((diff.length / HARD_LIMIT) * 100).toFixed(1)}%`,
    shortStat: git(statArgs) || "0 files changed",
    status: statusFor(diff.length),
  };
}

// Output / 输出
function printBudget(result) {
  console.log(`${result.label}: ${result.chars} chars (${result.percent} of ${HARD_LIMIT})`);
  console.log(`status: ${result.status}`);
  console.log(`stat: ${result.shortStat}`);
}

const baseInfo = explicitBase
  ? {
      base: explicitBase,
      source: "explicit argument",
    }
  : inferBase();

const dirty = git(["status", "--porcelain"]) !== "";
const mergeBase = git(["merge-base", baseInfo.base, "HEAD"]);
const results = [measureDiff("committed", `${baseInfo.base}...HEAD`)];

if (dirty) {
  results.push(measureDiff("with worktree", mergeBase));
}

console.log(`virganol diff budget`);
console.log(`base: ${baseInfo.base} (${baseInfo.source})`);
console.log(`hard limit: ${HARD_LIMIT} diff characters`);

for (const result of results) {
  console.log("");
  printBudget(result);
}

if (results.some((result) => result.chars >= HARD_LIMIT)) {
  process.exit(1);
}
