// dev/scripts/rust/comments/build/environment.mjs
import { loadConfig } from "../config/load.mjs";
import { buildCli } from "./cli.mjs";

export function prepareTestEnvironment() {
  const { adapter } = loadConfig("outer-doc-comments");
  const environment = { ...process.env };

  if (adapter === "cli") {
    console.log("\nrust comments: build cli adapter");
    environment.VIRGANOL_RUST_COMMENTS_CLI_PATH = buildCli({ profile: "debug" });
    return environment;
  }

  if (adapter === "napi") {
    // TODO: build the NAPI adapter once its crate is available.
    return environment;
  }

  throw new Error(`unsupported Outer Doc Comments adapter: ${adapter}`);
}
