// dev/scripts/rust/comments/benchmarks/adapter-comparison.bench.mjs
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";

import { prepareAdapterEnvironment } from "../build/environment.mjs";
import { loadConfig } from "../config/load.mjs";
import { collectRustFiles } from "../files.mjs";
import { runGuardWorkload } from "../guards/outer-line-doc-comments.guard.mjs";

const benchmarkDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(benchmarkDir, "../../../../..");
const outerLineDocTestPath = path.resolve(
  benchmarkDir,
  "../tests/outer-line-doc-comments.test.mjs"
);
const adapters = ["cli", "napi"];
const warmupRuns = 3;
const sampleRuns = 20;

function runOuterLineDocTest(adapter, environment) {
  const result = spawnSync(process.execPath, [outerLineDocTestPath, `--adapter=${adapter}`], {
    cwd: repoRoot,
    encoding: "utf8",
    env: environment,
    timeout: 120_000,
  });

  if (result.error) {
    throw new Error(`failed to start ${adapter} benchmark sample: ${result.error.message}`, {
      cause: result.error,
    });
  }

  if (result.status !== 0) {
    const detail = result.stderr.trim() || result.stdout.trim() || `exit code ${result.status}`;

    throw new Error(`${adapter} benchmark sample failed: ${detail}`);
  }
}

function percentile(sortedSamples, ratio) {
  const index = Math.ceil(sortedSamples.length * ratio) - 1;

  return sortedSamples[Math.max(0, index)];
}

function summarize(adapter, samples) {
  const sortedSamples = [...samples].sort((left, right) => left - right);
  const mean = samples.reduce((total, sample) => total + sample, 0) / samples.length;

  return {
    adapter,
    samples: samples.length,
    meanMs: mean.toFixed(3),
    medianMs: percentile(sortedSamples, 0.5).toFixed(3),
    p95Ms: percentile(sortedSamples, 0.95).toFixed(3),
    minMs: sortedSamples[0].toFixed(3),
    maxMs: sortedSamples.at(-1).toFixed(3),
  };
}

function benchmarkFixtureAdapter(adapter, environment) {
  for (let run = 0; run < warmupRuns; run += 1) {
    runOuterLineDocTest(adapter, environment);
  }

  const samples = [];

  for (let run = 0; run < sampleRuns; run += 1) {
    const startedAt = performance.now();

    runOuterLineDocTest(adapter, environment);
    samples.push(performance.now() - startedAt);
  }

  return summarize(adapter, samples);
}

async function runRepositoryAudit(adapter, environment, runGuardWorkload, rustFiles, config) {
  Object.assign(process.env, environment);

  return runGuardWorkload({
    repoRoot,
    rustFiles,
    config: { ...config, adapter, tolerance: "deferred" },
  });
}

async function benchmarkRepositoryAdapter(
  adapter,
  environment,
  runGuardWorkload,
  rustFiles,
  config
) {
  for (let run = 0; run < warmupRuns; run += 1) {
    await runRepositoryAudit(adapter, environment, runGuardWorkload, rustFiles, config);
  }

  const samples = [];
  let result;

  for (let run = 0; run < sampleRuns; run += 1) {
    const startedAt = performance.now();

    result = await runRepositoryAudit(adapter, environment, runGuardWorkload, rustFiles, config);
    samples.push(performance.now() - startedAt);
  }

  return { files: result.targetCount, ...summarize(adapter, samples) };
}

console.log("rust comments adapter comparison bench");
console.log("note: build, configuration, Git discovery, and reporting are excluded from samples");

const preparedAdapters = [];

for (const adapter of adapters) {
  preparedAdapters.push({
    adapter,
    environment: await prepareAdapterEnvironment({ adapter, profile: "release" }),
  });
}

console.log("\nfixture workload");
console.table(
  preparedAdapters.map(({ adapter, environment }) =>
    benchmarkFixtureAdapter(adapter, environment)
  )
);

const rustFiles = collectRustFiles(repoRoot);
const config = loadConfig("outer-line-doc-comments");

const correctnessResults = [];

for (const { adapter, environment } of preparedAdapters) {
  correctnessResults.push(
    await runRepositoryAudit(adapter, environment, runGuardWorkload, rustFiles, config)
  );
}

assert.deepEqual(
  correctnessResults[1],
  correctnessResults[0],
  "CLI and NAPI repository audit results differ"
);

const repositoryResults = [];

for (const { adapter, environment } of preparedAdapters) {
  repositoryResults.push(
    await benchmarkRepositoryAdapter(
      adapter,
      environment,
      runGuardWorkload,
      rustFiles,
      config
    )
  );
}

console.log("\nrepository audit workload (Outer guard only)");
console.table(repositoryResults);
