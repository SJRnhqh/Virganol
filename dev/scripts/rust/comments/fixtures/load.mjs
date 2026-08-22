// dev/scripts/rust/comments/fixtures/load.mjs
import { readFileSync, readdirSync } from "node:fs";
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

export function loadFixtureGroup(ruleName, groupName) {
  const groupDir = path.resolve(fixtureDir, ruleName, groupName);

  return readdirSync(groupDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".rs.template"))
    .map((entry) => entry.name.replace(/\.rs\.template$/, ""))
    .sort()
    .map((fixtureName) => ({
      fixtureName,
      ...loadFixture(ruleName, path.join(groupName, fixtureName)),
    }));
}
