// dev/scripts/repo/clean.mjs
// Imports / 依赖导入
import { existsSync, lstatSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Path setup / 路径设置
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");

// Clean target setup / 清理目标设置
const buildTargets = [
  "target",
  "apps/ui/dist",
  "apps/ui/dist-ssr",
  "apps/desktop/src-tauri/bin",
  "apps/desktop/src-tauri/gen/schemas",
];

const devCacheTargets = ["apps/ui/node_modules/.vite", "apps/ui/node_modules/.vite-temp"];

const dependencyTargets = ["node_modules", "apps/ui/node_modules", "apps/desktop/node_modules"];

const cleanTargets = [...buildTargets, ...devCacheTargets];
const purgeTargets = [...buildTargets, ...dependencyTargets];

const walkSkipDirs = new Set([".git", "node_modules", "target", "dist", "dist-ssr"]);

// Argument parsing / 参数解析
const mode = process.argv[2];

if (!["clean", "purge"].includes(mode)) {
  console.error("clean mode must be clean or purge");
  process.exit(1);
}

// Repository path normalization / 仓库路径规范化
function toRepoRelative(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function toScanPath(filePath) {
  return toRepoRelative(filePath) || ".";
}

function toTarget(relativePath) {
  const absolutePath = path.resolve(repoRoot, relativePath);

  if (!isInsideRepo(absolutePath)) {
    throw new Error(`refusing to remove path outside repository: ${absolutePath}`);
  }

  return {
    absolutePath,
    relativePath: toRepoRelative(absolutePath),
  };
}

// Target discovery / 清理目标发现
function collectTsBuildInfoFiles(dir) {
  const files = [];
  let entries;

  try {
    entries = readdirSync(dir);
  } catch (error) {
    console.warn(`warn    skip scan ${toScanPath(dir)}`);
    console.warn(`        ${error.message}`);
    return files;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    let stats;

    try {
      stats = lstatSync(fullPath);
    } catch (error) {
      console.warn(`warn    skip scan ${toScanPath(fullPath)}`);
      console.warn(`        ${error.message}`);
      continue;
    }

    if (stats.isSymbolicLink()) {
      continue;
    }

    if (stats.isDirectory()) {
      if (!walkSkipDirs.has(entry)) {
        files.push(...collectTsBuildInfoFiles(fullPath));
      }
      continue;
    }

    if (entry.endsWith(".tsbuildinfo")) {
      files.push(toRepoRelative(fullPath));
    }
  }

  return files;
}

function collectTargets() {
  const explicitTargets = mode === "purge" ? purgeTargets : cleanTargets;
  return [...new Set([...explicitTargets, ...collectTsBuildInfoFiles(repoRoot)])].map(toTarget);
}

function isInsideRepo(absolutePath) {
  const relativePath = path.relative(repoRoot, absolutePath);

  return relativePath !== "" && !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
}

// Cleaning / 清理执行
console.log(`virganol ${mode}\nrepo: ${repoRoot}\n`);

let failedCount = 0;
let skippedCount = 0;
let removedCount = 0;

for (const target of collectTargets()) {
  if (!existsSync(target.absolutePath)) {
    skippedCount += 1;
    console.log(`skip    ${target.relativePath}`);
    continue;
  }

  try {
    rmSync(target.absolutePath, {
      force: true,
      maxRetries: 3,
      recursive: true,
      retryDelay: 100,
    });
    removedCount += 1;
    console.log(`remove  ${target.relativePath}`);
  } catch (error) {
    failedCount += 1;
    console.error(`fail    ${target.relativePath}`);
    console.error(`        ${error.message}`);
  }
}

// Summary / 清理结果汇总
console.log("");
console.log(`removed: ${removedCount}`);
console.log(`skipped: ${skippedCount}`);

if (failedCount > 0) {
  console.error(`failed: ${failedCount}`);
  process.exit(1);
}
