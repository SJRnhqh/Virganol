// dev/scripts/rust/comments/rules/outer-doc-comments.mjs
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ruleDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(ruleDir, "../../../../..");

function checkWithCli(source) {
  const cliBinaryPath = process.env.VIRGANOL_RUST_COMMENTS_CLI_PATH;

  if (!cliBinaryPath) {
    throw new Error("Outer Doc Comments CLI adapter is not built");
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
        new Error(`failed to start Outer Doc Comments CLI: ${error.message}`, { cause: error })
      );
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve(null);
        return;
      }

      const detail = stderr.trim() || `exit code ${code ?? "unknown"}`;

      reject(new Error(`Outer Doc Comments CLI failed: ${detail}`));
    });
    child.stdin.end(source);
  });
}

function checkWithNapi() {
  throw new Error("TODO: implement Outer Doc Comments NAPI adapter");
}

export async function checkOuterDocComments({ adapter, source }) {
  if (adapter === "cli") {
    return checkWithCli(source);
  }

  if (adapter === "napi") {
    return checkWithNapi();
  }

  throw new Error(`unsupported Outer Doc Comments adapter: ${adapter}`);
}
