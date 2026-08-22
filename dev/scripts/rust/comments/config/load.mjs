// dev/scripts/rust/comments/config/load.mjs
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const tolerances = new Set(["deferred", "immediate"]);
let globalConfig;

function readConfig(name) {
  const configPath = path.resolve(configDir, `${name}.json`);

  return JSON.parse(readFileSync(configPath, "utf8"));
}

function validateConfig(config) {
  if (!tolerances.has(config.tolerance)) {
    throw new Error(`unsupported Rust comments tolerance: ${config.tolerance}`);
  }

  if (
    "allowedAsciiTerms" in config &&
    (!Array.isArray(config.allowedAsciiTerms) ||
      config.allowedAsciiTerms.some((term) => typeof term !== "string" || term.length === 0))
  ) {
    throw new Error("invalid Rust comments allowed ASCII terms");
  }

  return "allowedAsciiTerms" in config
    ? { ...config, allowedAsciiTerms: [...new Set(config.allowedAsciiTerms)] }
    : config;
}

export function loadConfig(guardName) {
  globalConfig ??= validateConfig(readConfig("global"));

  const configPath = path.resolve(configDir, `${guardName}.json`);

  if (!existsSync(configPath)) return globalConfig;

  return validateConfig({
    ...globalConfig,
    ...readConfig(guardName),
  });
}
