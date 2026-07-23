// dev/scripts/rust/comments/build/napi.mjs
import { NapiCli } from "@napi-rs/cli";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const buildDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(buildDir, "../../../../..");
const nodePackage = "virganol-rust-comment-checker-node";
const supportedProfiles = new Set(["debug", "release"]);

export async function buildNapi({ profile = "debug", target } = {}) {
  if (!supportedProfiles.has(profile)) {
    throw new Error(`unsupported Rust comments NAPI build profile: ${profile}`);
  }

  const outputDir = path.resolve(repoRoot, "target", "rust-comments", "napi", profile);
  const buildOptions = {
    cargoOptions: ["--locked"],
    configPath: path.resolve(buildDir, "napi.config.json"),
    cwd: repoRoot,
    manifestPath: path.resolve(repoRoot, "Cargo.toml"),
    noJsBinding: true,
    outputDir,
    package: nodePackage,
    packageJsonPath: path.resolve(repoRoot, "package.json"),
    platform: true,
    release: profile === "release",
    target,
  };

  let outputs;

  try {
    const { task } = await new NapiCli().build(buildOptions);
    outputs = await task;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    throw new Error(`Rust comments NAPI build failed: ${message}`, { cause: error });
  }

  const addons = outputs.filter(({ kind }) => kind === "node");

  if (addons.length !== 1) {
    throw new Error(`expected one Rust comments NAPI artifact, found ${addons.length}`);
  }

  const addonPath = addons[0].path;

  if (!existsSync(addonPath)) {
    throw new Error(`Rust comments NAPI build artifact not found: ${addonPath}`);
  }

  return addonPath;
}
