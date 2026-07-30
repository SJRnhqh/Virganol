// dev/scripts/rust/comments/benchmarks/adapter-comparison.bench.mjs
import { spawnSync } from "node:child_process";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";

import { prepareAdapterEnvironment } from "../build/environment.mjs";

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

function benchmarkAdapter(adapter, environment) {
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

console.log("rust comments adapter comparison bench");
console.log(
  "note: Outer Line Doc Comments rule semantics are TODO; current results cover fixture parsing"
);

const preparedAdapters = [];

for (const adapter of adapters) {
  preparedAdapters.push({
    adapter,
    environment: await prepareAdapterEnvironment({ adapter, profile: "release" }),
  });
}

const results = preparedAdapters.map(({ adapter, environment }) => {
  console.log(`\nrust comments adapter comparison: ${adapter}`);

  return benchmarkAdapter(adapter, environment);
});

console.table(results);
