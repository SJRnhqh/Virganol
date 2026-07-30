// dev/scripts/rust/comments/rules/outer-line-doc-comments.mjs
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ruleDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(ruleDir, "../../../../..");
const require = createRequire(import.meta.url);

function checkWithCli(source) {
  const cliBinaryPath = process.env.VIRGANOL_RUST_COMMENTS_CLI_PATH;

  if (!cliBinaryPath) {
    throw new Error("Outer Line Doc Comments CLI adapter is not built");
  }

  return new Promise((resolve, reject) => {
    const child = spawn(cliBinaryPath, [], {
      cwd: repoRoot,
      stdio: ["pipe", "ignore", "pipe"],
    });
    let stderr = "";

    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", (error) => {
      reject(
        new Error(`failed to start Outer Line Doc Comments CLI: ${error.message}`, {
          cause: error,
        })
      );
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve(null);
        return;
      }

      const detail = stderr.trim() || `exit code ${code ?? "unknown"}`;

      reject(new Error(`Outer Line Doc Comments CLI failed: ${detail}`));
    });
    child.stdin.end(source);
  });
}

function loadNapiAdapter() {
  const addonPath = process.env.VIRGANOL_RUST_COMMENTS_NAPI_PATH;

  if (!addonPath) {
    throw new Error("Outer Line Doc Comments NAPI adapter is not built");
  }

  let adapter;

  try {
    adapter = require(addonPath);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    throw new Error(`failed to load Outer Line Doc Comments NAPI adapter: ${message}`, {
      cause: error,
    });
  }

  if (typeof adapter.check !== "function") {
    throw new Error("Outer Line Doc Comments NAPI adapter does not export check");
  }

  return adapter;
}

function checkWithNapi(source) {
  return loadNapiAdapter().check(source);
}

export async function checkOuterLineDocComments({ adapter, source }) {
  if (adapter === "cli") {
    return checkWithCli(source);
  }

  if (adapter === "napi") {
    return checkWithNapi(source);
  }

  throw new Error(`unsupported Outer Line Doc Comments adapter: ${adapter}`);
}
