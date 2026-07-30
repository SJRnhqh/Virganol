// dev/scripts/rust/lint-item-doc-comments.mjs
// Imports / 依赖导入
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import config from "./config/lint/item-doc-comments.config.mjs";

// Path setup / 路径设置
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");

// Lint rule setup / 检查规则设置
const enabledItems = new Set(config.items ?? []);
const chinesePattern = /\p{Script=Han}/u;
const englishPattern = /[A-Za-z]/;
const visibility = String.raw`(?:pub(?:\([^)]*\))?\s+)?`;
const fnQualifiers = String.raw`(?:(?:pub(?:\([^)]*\))?|async|const|unsafe|default|extern\s+"[^"]+")\s+)*`;

const itemDetectors = [
  {
    kind: "fn",
    label: "function or method",
    pattern: new RegExp(`^${fnQualifiers}fn\\s+([A-Za-z_][A-Za-z0-9_]*)\\b`),
  },
  {
    kind: "struct",
    label: "struct",
    pattern: new RegExp(`^${visibility}struct\\s+([A-Za-z_][A-Za-z0-9_]*)\\b`),
  },
  {
    kind: "trait",
    label: "trait",
    pattern: new RegExp(`^${visibility}(?:unsafe\\s+)?trait\\s+([A-Za-z_][A-Za-z0-9_]*)\\b`),
  },
];

// Repository path normalization / 仓库路径规范化
function toRepoRelative(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function normalizeRepoPath(repoPath) {
  return repoPath
    .split(/[\\/]+/)
    .filter(Boolean)
    .join("/");
}

function toRepoTarget(relativePath) {
  const absolutePath = path.resolve(repoRoot, relativePath);
  const repoRelative = path.relative(repoRoot, absolutePath);

  if (repoRelative === "" || repoRelative.startsWith("..") || path.isAbsolute(repoRelative)) {
    throw new Error(`target must stay inside repository: ${relativePath}`);
  }

  return absolutePath;
}

// Configuration validation / 配置校验
function validateConfig() {
  if (!Array.isArray(config.targets) || config.targets.length === 0) {
    throw new Error("item doc comment lint config must define at least one target");
  }

  if (!Array.isArray(config.excludes)) {
    throw new Error("item doc comment lint config excludes must be an array");
  }

  if (!Array.isArray(config.items) || config.items.length === 0) {
    throw new Error("item doc comment lint config items must define at least one Rust item kind");
  }

  if (!Array.isArray(config.allowedChineseTerms)) {
    throw new Error("item doc comment lint config allowedChineseTerms must be an array");
  }

  if (config.allowedChineseTerms.some((term) => typeof term !== "string" || term === "")) {
    throw new Error(
      "item doc comment lint config allowedChineseTerms must contain non-empty strings"
    );
  }
}

// Rust source discovery / Rust 源文件收集
function matchesExclude(relativePath, excludePath) {
  const normalized = normalizeRepoPath(excludePath);

  if (normalized.startsWith("**/")) {
    const suffix = normalized.slice(3);

    return relativePath === suffix || relativePath.endsWith(`/${suffix}`);
  }

  return relativePath === normalized || relativePath.startsWith(`${normalized}/`);
}

function isExcluded(relativePath) {
  return config.excludes.some((entry) => matchesExclude(relativePath, entry));
}

function collectRustFiles(targetPath) {
  const stats = statSync(targetPath);

  if (stats.isDirectory()) {
    return readdirSync(targetPath).flatMap((entry) =>
      collectRustFiles(path.join(targetPath, entry))
    );
  }

  return targetPath.endsWith(".rs") ? [targetPath] : [];
}

function collectTargets() {
  return config.targets.flatMap((target) => {
    const targetPath = toRepoTarget(target);

    if (!existsSync(targetPath)) {
      throw new Error(`rust item doc comment lint target not found: ${target}`);
    }

    return collectRustFiles(targetPath);
  });
}

// Rust item discovery / Rust 项发现
function detectItem(line) {
  const trimmed = line.trim();

  if (trimmed.startsWith("//")) {
    return null;
  }

  for (const detector of itemDetectors) {
    if (!enabledItems.has(detector.kind)) {
      continue;
    }

    const match = trimmed.match(detector.pattern);

    if (match) {
      return {
        kind: detector.kind,
        label: detector.label,
        name: match[1],
      };
    }
  }

  return null;
}

// Item doc comment shape checks / 项文档注释形态检查
function isDocCommentLine(line) {
  return /^\s*\/\/\/(?!\/)/.test(line);
}

function isAttributeLine(line) {
  return /^\s*#\[/.test(line);
}

function docContent(line) {
  return line.replace(/^\s*\/\/\/\s?/, "");
}

function stripAllowedChineseTerms(line) {
  return config.allowedChineseTerms.reduce((content, term) => content.split(term).join(""), line);
}

function collectDocBlock(lines, itemIndex) {
  let blockEndIndex = itemIndex - 1;

  while (blockEndIndex >= 0 && isAttributeLine(lines[blockEndIndex])) {
    blockEndIndex -= 1;
  }

  const block = [];
  let index = blockEndIndex;

  while (index >= 0 && isDocCommentLine(lines[index])) {
    block.unshift(lines[index]);
    index -= 1;
  }

  return block;
}

function validateDocBlock(block) {
  if (block.length !== 3) {
    return `expected exactly three doc comment lines, found ${block.length}`;
  }

  const englishLine = docContent(block[0]).trim();
  const blankLine = docContent(block[1]).trim();
  const chineseLine = docContent(block[2]).trim();

  if (!englishPattern.test(englishLine) || chinesePattern.test(englishLine)) {
    return "expected first doc comment line to contain English text only";
  }

  if (blankLine !== "") {
    return "expected second doc comment line to be blank";
  }

  const chineseLineWithoutAllowedTerms = stripAllowedChineseTerms(chineseLine);

  if (!chinesePattern.test(chineseLine) || englishPattern.test(chineseLineWithoutAllowedTerms)) {
    return "expected third doc comment line to contain Chinese text without non-whitelisted ASCII letters";
  }

  return null;
}

// Lint execution / 检查执行
let rustFiles;

try {
  validateConfig();
  rustFiles = [...new Set(collectTargets())]
    .map((filePath) => ({
      filePath,
      relativePath: toRepoRelative(filePath),
    }))
    .filter(({ relativePath }) => !isExcluded(relativePath))
    .sort((a, b) => a.relativePath.localeCompare(b.relativePath));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

let checkedItems = 0;
const failures = [];

for (const { filePath, relativePath } of rustFiles) {
  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);

  lines.forEach((line, index) => {
    const item = detectItem(line);

    if (!item) {
      return;
    }

    checkedItems += 1;

    const block = collectDocBlock(lines, index);
    const issue = validateDocBlock(block);

    if (issue) {
      failures.push({
        relativePath,
        line: index + 1,
        item,
        issue,
      });
    }
  });
}

// Failure report / 失败报告
if (failures.length > 0) {
  console.error(`rust item doc comment lint failed (${failures.length} failure(s))\n`);
  console.error(
    "rule: exactly three adjacent outer line doc comment lines: English, blank, Chinese without non-whitelisted ASCII\n"
  );
  console.error(`targets: ${config.targets.join(", ")}`);
  console.error(`excludes: ${config.excludes.length > 0 ? config.excludes.join(", ") : "<none>"}`);
  console.error(`items: ${[...enabledItems].join(", ")}\n`);
  console.error(
    `allowed Chinese terms: ${
      config.allowedChineseTerms.length > 0 ? config.allowedChineseTerms.join(", ") : "<none>"
    }\n`
  );

  for (const failure of failures) {
    console.error(`location: ${failure.relativePath}:${failure.line}`);
    console.error(`kind:     ${failure.item.label}`);
    console.error(`name:     ${failure.item.name}`);
    console.error(`issue:    ${failure.issue}`);
    console.error("");
  }

  process.exit(1);
}

console.log(`rust item doc comment lint passed (${rustFiles.length} files, ${checkedItems} items)`);
