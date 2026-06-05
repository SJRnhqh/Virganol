// dev/scripts/rust/lint-source-headers.mjs
// Imports / 依赖导入
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Path setup / 路径设置
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");
const rustSourceRoot = path.join(repoRoot, "apps/desktop/src-tauri/src");

// Repository path normalization / 仓库路径规范化
function toRepoRelative(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

// Rust source discovery / Rust 源文件收集
function collectRustFiles(dir) {
  const files = [];

  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...collectRustFiles(fullPath));
      continue;
    }

    if (entry.endsWith(".rs")) {
      files.push(fullPath);
    }
  }

  return files;
}

// Source root guard / 源码根目录校验
if (!existsSync(rustSourceRoot)) {
  console.error(`rust source root not found: ${toRepoRelative(rustSourceRoot)}`);
  process.exit(1);
}

// Header linting / 文件头检查
const failures = collectRustFiles(rustSourceRoot).flatMap((filePath) => {
  const relativePath = toRepoRelative(filePath);
  const expected = `// ${relativePath}`;
  const actual = readFileSync(filePath, "utf8").split(/\r?\n/, 1)[0] ?? "";

  return actual === expected
    ? []
    : [
        {
          relativePath,
          expected,
          actual,
        },
      ];
});

// Failure report / 失败报告
if (failures.length > 0) {
  console.error("rust source header lint failed\n");

  for (const failure of failures) {
    console.error(failure.relativePath);
    console.error(`  expected: ${failure.expected}`);
    console.error(`  actual:   ${failure.actual || "<empty>"}`);
    console.error("");
  }

  process.exit(1);
}

console.log("rust source header lint passed");
