// dev/scripts/rust/comments/guards/load.mjs
import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const guardDir = path.dirname(fileURLToPath(import.meta.url));

export async function loadGuards() {
  const guardFiles = readdirSync(guardDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".guard.mjs"))
    .map((entry) => entry.name)
    .sort();

  if (guardFiles.length === 0) {
    throw new Error("no Rust comment guards found");
  }

  const guards = [];

  for (const guardFile of guardFiles) {
    const guardName = path.basename(guardFile, ".guard.mjs");
    const guardPath = path.resolve(guardDir, guardFile);
    const { runGuard } = await import(pathToFileURL(guardPath));

    if (typeof runGuard !== "function") {
      throw new Error(`${guardFile} does not export runGuard`);
    }

    guards.push({ guardName, runGuard });
  }

  return guards;
}
