// dev/scripts/rust/comments/config/load.mjs
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const configDir = path.dirname(fileURLToPath(import.meta.url));

export function loadConfig(name) {
  const configPath = path.resolve(configDir, `${name}.json`);

  return JSON.parse(readFileSync(configPath, "utf8"));
}
