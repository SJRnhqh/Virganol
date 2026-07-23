// dev/scripts/rust/comments/build/environment.mjs
import { buildCli } from "./cli.mjs";
import { buildNapi } from "./napi.mjs";

export async function prepareAdapterEnvironment({ adapter, profile = "debug" }) {
  const environment = { ...process.env };

  if (adapter === "cli") {
    console.log("\nrust comments: build cli adapter");
    environment.VIRGANOL_RUST_COMMENTS_CLI_PATH = buildCli({ profile });
    return environment;
  }

  if (adapter === "napi") {
    console.log("\nrust comments: build napi adapter");
    environment.VIRGANOL_RUST_COMMENTS_NAPI_PATH = await buildNapi({ profile });
    return environment;
  }

  throw new Error(`unsupported Outer Doc Comments adapter: ${adapter}`);
}
