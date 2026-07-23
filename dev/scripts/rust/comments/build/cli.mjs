// dev/scripts/rust/comments/build/cli.mjs
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const buildDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(buildDir, "../../../../..");
const cliPackage = "virganol-rust-comment-checker-cli";
const supportedProfiles = new Set(["debug", "release"]);

export function buildCli({ profile = "debug" } = {}) {
  if (!supportedProfiles.has(profile)) {
    throw new Error(`unsupported Rust comments CLI build profile: ${profile}`);
  }

  const args = ["build", "--locked", "--package", cliPackage];

  if (profile === "release") {
    args.push("--release");
  }

  const result = spawnSync("cargo", args, {
    cwd: repoRoot,
    stdio: "inherit",
  });

  if (result.error) {
    throw new Error(`failed to start Rust comments CLI build: ${result.error.message}`, {
      cause: result.error,
    });
  }

  if (result.status !== 0) {
    throw new Error(`Rust comments CLI build failed with exit code ${result.status ?? "unknown"}`);
  }

  const targetDir = path.resolve(repoRoot, process.env.CARGO_TARGET_DIR ?? "target");
  const binaryName = process.platform === "win32" ? `${cliPackage}.exe` : cliPackage;
  const binaryPath = path.resolve(targetDir, profile, binaryName);

  if (!existsSync(binaryPath)) {
    throw new Error(`Rust comments CLI build artifact not found: ${binaryPath}`);
  }

  return binaryPath;
}
