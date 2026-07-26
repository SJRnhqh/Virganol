// dev/scripts/rust/comments/fixtures/load.mjs
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const fixtureDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(fixtureDir, "../../../../..");

export function loadFixture(ruleName, fixtureName) {
  const fixturePath = path.resolve(fixtureDir, ruleName, `${fixtureName}.rs.template`);

  return {
    fixtureRelativePath: path.relative(repoRoot, fixturePath).split(path.sep).join("/"),
    source: readFileSync(fixturePath, "utf8"),
  };
}
