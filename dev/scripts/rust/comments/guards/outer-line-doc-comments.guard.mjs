// dev/scripts/rust/comments/guards/outer-line-doc-comments.guard.mjs
import { readFileSync } from "node:fs";
import path from "node:path";

import { prepareAdapterEnvironment } from "../build/environment.mjs";
import { checkOuterLineDocComments } from "../rules/outer-line-doc-comments.mjs";

function selectCoverageFiles(rustFiles, coverage) {
  const { include, exclude } = coverage;
  const isInvalid =
    !Array.isArray(include) ||
    !Array.isArray(exclude) ||
    include.length === 0 ||
    [...include, ...exclude].some((pattern) => typeof pattern !== "string" || pattern.length === 0);

  if (isInvalid) {
    throw new Error("invalid Outer Line Doc Comments coverage configuration");
  }

  return rustFiles.filter(
    (relativePath) =>
      include.some((pattern) => path.matchesGlob(relativePath, pattern)) &&
      !exclude.some((pattern) => path.matchesGlob(relativePath, pattern))
  );
}

export async function runGuard({ repoRoot, rustFiles, config }) {
  const { tolerance, adapter, coverage } = config;
  const selectedFiles = selectCoverageFiles(rustFiles, coverage);

  if (selectedFiles.length === 0) {
    throw new Error("Outer Line Doc Comments coverage matched no Rust source files");
  }

  Object.assign(process.env, await prepareAdapterEnvironment({ adapter, profile: "debug" }));

  const diagnostics = [];
  let checkedCount = 0;

  for (const relativePath of selectedFiles) {
    const source = readFileSync(path.resolve(repoRoot, relativePath), "utf8");

    checkedCount += 1;

    try {
      await checkOuterLineDocComments({ adapter, source });
    } catch (error) {
      if (!error || typeof error !== "object" || !("code" in error)) {
        throw error;
      }

      diagnostics.push({
        relativePath,
        code: error.code,
      });

      if (tolerance === "immediate") {
        break;
      }
    }
  }

  return { targetCount: selectedFiles.length, checkedCount, diagnostics };
}
