// dev/scripts/rust/contract-reexport-visibility.mjs
// Rust re-export visibility contract runner / Rust re-export 可见性契约执行脚本
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import config from "./config/contract/reexport-visibility.config.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");

const enabledItems = new Set(config.items ?? []);
const rustIdentifier = String.raw`[A-Za-z_][A-Za-z0-9_]*`;
const visibilityPattern = String.raw`(?<visibility>pub(?:\([^)]*\))?)`;
const fnQualifiers = String.raw`(?:(?:async|const|unsafe|default|extern\s+"[^"]+")\s+)*`;

const itemPatterns = {
  fn: `${fnQualifiers}fn`,
  struct: "struct",
  enum: "enum",
  union: "union",
  trait: String.raw`(?:unsafe\s+)?trait`,
  type: "type",
  const: "const",
  static: String.raw`static(?:\s+mut)?`,
};

const itemDetectors = Object.entries(itemPatterns).map(([kind, pattern]) => ({
  kind,
  pattern: new RegExp(`^${visibilityPattern}\\s+${pattern}\\s+(?<name>${rustIdentifier})\\b`),
}));

// Path and module helpers / 路径与模块辅助函数
function repoPath(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function normalizedPath(filePath) {
  return filePath
    .split(/[\\/]+/)
    .filter(Boolean)
    .join("/");
}

function normalizedRustPath(rustPath) {
  return rustPath.replace(/\s+/g, "").replace(/^self::/, "");
}

function repoTarget(configuredPath) {
  const absolutePath = path.resolve(repoRoot, configuredPath);
  const relativePath = path.relative(repoRoot, absolutePath);

  if (relativePath === "" || relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error(
      `re-export visibility contract target must stay inside repository: ${configuredPath}`
    );
  }

  return absolutePath;
}

function sourceInfo(filePath) {
  const relativePath = repoPath(filePath);
  const marker = "/src/";
  const markerIndex = relativePath.lastIndexOf(marker);

  if (markerIndex === -1) {
    throw new Error(`rust source path must live under a src directory: ${relativePath}`);
  }

  const sourceRelativePath = normalizedPath(relativePath.slice(markerIndex + marker.length));
  const sourceRoot = path.join(repoRoot, relativePath.slice(0, markerIndex + marker.length));

  if (sourceRelativePath === "lib.rs" || sourceRelativePath === "main.rs") {
    return { relativePath, sourceRoot, modulePath: [] };
  }

  const modulePath = sourceRelativePath.endsWith("/mod.rs")
    ? sourceRelativePath.slice(0, -"/mod.rs".length).split("/")
    : sourceRelativePath.slice(0, -".rs".length).split("/");

  return { relativePath, sourceRoot, modulePath };
}

function ancestorModFiles(targetPath) {
  const targetFile = statSync(targetPath).isDirectory()
    ? path.join(targetPath, "mod.rs")
    : targetPath;
  const { sourceRoot, modulePath } = sourceInfo(targetFile);
  const files = [];

  for (let length = modulePath.length - 1; length >= 0; length -= 1) {
    if (length === 0) {
      files.push(
        ...["lib.rs", "main.rs"]
          .map((rootFile) => path.join(sourceRoot, rootFile))
          .filter(existsSync)
      );
      continue;
    }

    const filePath = path.join(sourceRoot, ...modulePath.slice(0, length), "mod.rs");

    if (existsSync(filePath)) {
      files.push(filePath);
    }
  }

  return files;
}

// Configuration and source discovery / 配置与源码发现
function assertStringArray(value, label) {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string" || entry === "")) {
    throw new Error(
      `re-export visibility contract config ${label} must be an array of non-empty strings`
    );
  }
}

function validateConfig() {
  for (const label of ["targets", "items"]) {
    assertStringArray(config[label], label);
  }
}

function rustFiles(targetPath) {
  const stats = statSync(targetPath);

  if (!stats.isDirectory()) {
    return targetPath.endsWith(".rs") ? [targetPath] : [];
  }

  return readdirSync(targetPath).flatMap((entry) => rustFiles(path.join(targetPath, entry)));
}

function readSource(filePath) {
  return {
    filePath,
    ...sourceInfo(filePath),
    lines: readFileSync(filePath, "utf8").split(/\r?\n/),
  };
}

// Rust item discovery / Rust 项发现
function itemFromLine(line) {
  const trimmed = line.trim();

  if (trimmed.startsWith("//")) {
    return null;
  }

  for (const detector of itemDetectors) {
    if (!enabledItems.has(detector.kind)) {
      continue;
    }

    const match = trimmed.match(detector.pattern);

    if (match?.groups) {
      return {
        kind: detector.kind,
        name: match.groups.name,
        visibility: match.groups.visibility,
      };
    }
  }

  return null;
}

function braceDelta(line) {
  const code = line
    .replace(/\/\/.*$/u, "")
    .replace(/"([^"\\]|\\.)*"/gu, '""')
    .replace(/'([^'\\]|\\.)*'/gu, "''");

  return [...code.matchAll(/\{/gu)].length - [...code.matchAll(/\}/gu)].length;
}

function collectItems(source) {
  let depth = 0;
  const items = [];

  for (const [index, line] of source.lines.entries()) {
    const item = depth === 0 ? itemFromLine(line) : null;
    depth = Math.max(0, depth + braceDelta(line));

    if (item) {
      items.push({
        ...item,
        line: index + 1,
        relativePath: source.relativePath,
        modulePath: source.modulePath,
      });
    }
  }

  return items;
}

// Rust re-export discovery / Rust re-export 发现
function normalizeUseStatement(statement) {
  return statement
    .replace(/\s+/g, " ")
    .replace(/\s*{\s*/g, "{")
    .replace(/\s*}\s*/g, "}")
    .replace(/\s*,\s*/g, ",")
    .replace(/\s*;\s*$/g, ";")
    .trim();
}

function unsupportedUseIssue(target) {
  if (/\bas\b/.test(target)) {
    return `unsupported aliased re-export target: ${target}`;
  }

  if (target.includes("*")) {
    return `unsupported glob re-export target: ${target}`;
  }

  if (/::\{.*(::|\bself\b)/s.test(target)) {
    return `unsupported nested re-export group target: ${target}`;
  }

  return null;
}

function pubUseStatements(lines) {
  const statements = [];
  let active = null;

  for (const [index, line] of lines.entries()) {
    const trimmed = line.trim();

    if (!active && !/^pub(?:\([^)]*\))?\s+use\b/.test(trimmed)) {
      continue;
    }

    active = active
      ? { ...active, text: `${active.text}\n${trimmed}` }
      : { line: index + 1, text: trimmed };

    if (trimmed.endsWith(";")) {
      statements.push(active);
      active = null;
    }
  }

  return statements;
}

function isRustIdentifier(value) {
  return new RegExp(`^${rustIdentifier}$`).test(value);
}

function parseUseTarget(target) {
  const unsupportedIssue = unsupportedUseIssue(target);

  if (unsupportedIssue) {
    return { issue: unsupportedIssue };
  }

  const braceMatch = target.match(/^(?<source>.+)::\{(?<symbols>.*)\}$/s);

  if (braceMatch?.groups) {
    const symbols = braceMatch.groups.symbols
      .split(",")
      .map((symbol) => symbol.trim())
      .filter(Boolean);

    if (symbols.some((symbol) => !isRustIdentifier(symbol))) {
      return { issue: `unsupported re-export group symbol syntax: ${target}` };
    }

    return {
      sourcePath: normalizedRustPath(braceMatch.groups.source),
      symbols,
    };
  }

  const separatorIndex = target.lastIndexOf("::");

  if (separatorIndex === -1) {
    return isRustIdentifier(target)
      ? {
          sourcePath: "self",
          symbols: [target],
        }
      : null;
  }

  const symbol = target.slice(separatorIndex + 2).trim();

  return isRustIdentifier(symbol)
    ? {
        sourcePath: normalizedRustPath(target.slice(0, separatorIndex)),
        symbols: [symbol],
      }
    : { issue: `unsupported re-export symbol syntax: ${target}` };
}

function collectReexports(source) {
  return pubUseStatements(source.lines).flatMap((statement) => {
    const normalized = normalizeUseStatement(statement.text);
    const match = normalized.match(/^(?<visibility>pub(?:\([^)]*\))?)\s+use\s+(?<target>.+);$/s);

    if (!match?.groups) {
      return [
        {
          line: statement.line,
          relativePath: source.relativePath,
          modulePath: source.modulePath,
          issue: `unsupported pub use statement syntax: ${normalized}`,
        },
      ];
    }

    const target = parseUseTarget(match.groups.target);

    if (!target || target.issue) {
      return [
        {
          line: statement.line,
          relativePath: source.relativePath,
          modulePath: source.modulePath,
          issue: target?.issue ?? `unsupported re-export target syntax: ${match.groups.target}`,
        },
      ];
    }

    return target.symbols.map((symbol) => ({
      line: statement.line,
      visibility: match.groups.visibility,
      sourcePath: target.sourcePath,
      symbol,
      relativePath: source.relativePath,
      modulePath: source.modulePath,
    }));
  });
}

// Visibility scope analysis / 可见范围分析
function scope(pathSegments = [], publicScope = false) {
  return { public: publicScope, path: pathSegments };
}

function parseVisibility(visibility, modulePath) {
  if (visibility === "pub") {
    return scope([], true);
  }

  const inner = visibility.match(/^pub\((?<inner>.+)\)$/)?.groups?.inner.replace(/\s+/g, "");

  if (!inner || inner === "crate" || inner === "incrate") {
    return scope();
  }

  if (inner === "self") {
    return scope(modulePath);
  }

  if (inner === "super") {
    return scope(modulePath.slice(0, -1));
  }

  const relativeScopes = [
    ["incrate::", []],
    ["inself::", modulePath],
    ["insuper::", modulePath.slice(0, -1)],
  ];

  for (const [prefix, basePath] of relativeScopes) {
    if (inner.startsWith(prefix)) {
      return scope([...basePath, ...inner.slice(prefix.length).split("::").filter(Boolean)]);
    }
  }

  throw new Error(`unsupported Rust visibility scope: ${visibility}`);
}

function scopePath(scopeToFormat) {
  return scopeToFormat.path.length === 0 ? "crate" : `crate::${scopeToFormat.path.join("::")}`;
}

function formatScope(scopeToFormat) {
  return scopeToFormat.public ? "pub" : scopePath(scopeToFormat);
}

function canonicalVisibility(scopeToFormat) {
  if (scopeToFormat.public) {
    return "pub";
  }

  return scopeToFormat.path.length === 0 ? "pub(crate)" : `pub(in ${scopePath(scopeToFormat)})`;
}

function sameScope(left, right) {
  return left.public || right.public
    ? left.public === right.public
    : moduleKey(left.path) === moduleKey(right.path);
}

function isNoWiderThan(candidate, boundary) {
  return (
    boundary.public ||
    (!candidate.public &&
      boundary.path.every((segment, index) => candidate.path[index] === segment))
  );
}

function expectedVisibility(reexport, finalScope) {
  if (sameScope(scope(reexport.modulePath), finalScope)) {
    return "pub(self)";
  }

  if (sameScope(scope(reexport.modulePath.slice(0, -1)), finalScope)) {
    return "pub(super)";
  }

  return canonicalVisibility(finalScope);
}

// Re-export chain resolution / re-export 链解析
function moduleKey(modulePath) {
  return modulePath.join("::");
}

function symbolKey(modulePath, symbol) {
  return `${moduleKey(modulePath)}:${symbol}`;
}

function sourceModulePath(modulePath, sourcePath) {
  const segments = normalizedRustPath(sourcePath).split("::").filter(Boolean);

  if (segments[0] === "crate") {
    return segments.slice(1);
  }

  const resolved = [...modulePath];

  while (segments[0] === "super") {
    resolved.pop();
    segments.shift();
  }

  if (segments[0] === "self") {
    segments.shift();
  }

  return [...resolved, ...segments];
}

function indexBySymbol(entries, symbolOf) {
  const index = new Map();

  for (const entry of entries) {
    const key = symbolKey(entry.modulePath, symbolOf(entry));
    index.set(key, [...(index.get(key) ?? []), entry]);
  }

  return index;
}

function topLevelReexports(reexports) {
  const reexportedSources = new Set(
    reexports.map((reexport) =>
      symbolKey(sourceModulePath(reexport.modulePath, reexport.sourcePath), reexport.symbol)
    )
  );

  return reexports.filter(
    (reexport) => !reexportedSources.has(symbolKey(reexport.modulePath, reexport.symbol))
  );
}

function resolveReexport(reexport, itemIndex, reexportIndex, seen = new Set()) {
  const sourceModule = sourceModulePath(reexport.modulePath, reexport.sourcePath);
  const key = symbolKey(sourceModule, reexport.symbol);

  if (seen.has(key)) {
    return [];
  }

  const nextSeen = new Set([...seen, key]);
  const directItems = itemIndex.get(key) ?? [];

  if (directItems.length > 0) {
    return directItems.map((item) => ({ item, chain: [reexport] }));
  }

  return (reexportIndex.get(key) ?? []).flatMap((downstream) =>
    resolveReexport(downstream, itemIndex, reexportIndex, nextSeen).map((result) => ({
      item: result.item,
      chain: [reexport, ...result.chain],
    }))
  );
}

// Contract checks / 契约检查
function failureFor(target, entry, issue) {
  return { target, relativePath: entry.relativePath, line: entry.line, issue };
}

function scopeFailureFor(target, entry, candidateScope, item, itemScope) {
  if (isNoWiderThan(candidateScope, itemScope)) {
    return null;
  }

  return failureFor(
    target,
    entry,
    `re-export scope ${formatScope(candidateScope)} is wider than ${item.name} scope ${formatScope(itemScope)}`
  );
}

function validateReexportChain(target, reexport, result) {
  const itemScope = parseVisibility(result.item.visibility, result.item.modulePath);
  const finalScope = parseVisibility(reexport.visibility, reexport.modulePath);

  return result.chain.flatMap((chainReexport) => {
    const reexportScope = parseVisibility(chainReexport.visibility, chainReexport.modulePath);
    const compactVisibility = expectedVisibility(chainReexport, finalScope);

    return [
      scopeFailureFor(target, chainReexport, reexportScope, result.item, itemScope),
      chainReexport.visibility.replace(/\s+/g, "") === compactVisibility.replace(/\s+/g, "")
        ? null
        : failureFor(
            target,
            chainReexport,
            `expected compact visibility ${compactVisibility} for ${chainReexport.sourcePath}::${chainReexport.symbol}, found ${chainReexport.visibility}`
          ),
    ].filter(Boolean);
  });
}

function readSourceSet(sourcePaths) {
  return [...new Set(sourcePaths)].map((filePath) => readSource(filePath));
}

function isUnsupportedReexport(entry) {
  return Boolean(entry.issue);
}

function runTarget(target) {
  const targetPath = repoTarget(target);

  if (!existsSync(targetPath)) {
    throw new Error(`re-export visibility contract target not found: ${target}`);
  }

  const targetFiles = rustFiles(targetPath);
  const targetSources = targetFiles.map((filePath) => readSource(filePath));
  const reexportSources = readSourceSet([...targetFiles, ...ancestorModFiles(targetPath)]);
  const items = targetSources.flatMap(collectItems);
  const reexportEntries = reexportSources.flatMap(collectReexports);
  const unsupportedReexports = reexportEntries.filter(isUnsupportedReexport);
  const reexports = reexportEntries.filter((entry) => !isUnsupportedReexport(entry));
  const itemIndex = indexBySymbol(items, (item) => item.name);
  const reexportIndex = indexBySymbol(reexports, (reexport) => reexport.symbol);
  const validations = topLevelReexports(reexports).flatMap((reexport) =>
    resolveReexport(reexport, itemIndex, reexportIndex).flatMap((result) =>
      ({ reexport, result })
    )
  );
  const failures = [
    ...unsupportedReexports.map((entry) => failureFor(target, entry, entry.issue)),
    ...validations.flatMap(({ reexport, result }) => validateReexportChain(target, reexport, result)),
  ];

  return {
    failures,
    checkedItems: items.length,
    checkedReexports: reexportEntries.length,
    checkedChains: validations.length,
  };
}

// Contract execution / 契约执行
let results = [];

try {
  validateConfig();
  results = config.targets.map((target) => runTarget(target));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const checkedItems = results.reduce((sum, result) => sum + result.checkedItems, 0);
const checkedReexports = results.reduce((sum, result) => sum + result.checkedReexports, 0);
const checkedChains = results.reduce((sum, result) => sum + result.checkedChains, 0);
const failures = results.flatMap((result) => result.failures);

// Failure report / 失败报告
if (failures.length > 0) {
  console.error(`rust re-export visibility contract failed (${failures.length} failure(s))\n`);
  console.error("rule: re-export chain scope must not exceed the source item visibility scope\n");
  console.error(`targets: ${config.targets.join(", ")}`);
  console.error(`items: ${[...enabledItems].join(", ")}\n`);

  for (const failure of failures) {
    console.error(`location: ${failure.relativePath}:${failure.line}`);
    console.error(`target:   ${failure.target}`);
    console.error(`issue:    ${failure.issue}`);
    console.error("");
  }

  process.exit(1);
}

console.log(
  `rust re-export visibility contract passed (${config.targets.length} targets, ${checkedItems} items, ${checkedReexports} re-exports parsed, ${checkedChains} chains validated)`
);
