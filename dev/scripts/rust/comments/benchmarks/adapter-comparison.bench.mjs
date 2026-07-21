// dev/scripts/rust/comments/benchmarks/adapter-comparison.bench.mjs
import { spawnSync } from "node:child_process";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";

import { buildCli } from "../build/cli.mjs";

const benchmarkDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(benchmarkDir, "../../../../..");
const outerTestPath = path.resolve(benchmarkDir, "../tests/outer-doc-comments.test.mjs");
const warmupRuns = 3;
const sampleRuns = 20;

function runOuterTest(adapter, environment) {
  const result = spawnSync(process.execPath, [outerTestPath, `--adapter=${adapter}`], {
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
    runOuterTest(adapter, environment);
  }

  const samples = [];

  for (let run = 0; run < sampleRuns; run += 1) {
    const startedAt = performance.now();

    runOuterTest(adapter, environment);
    samples.push(performance.now() - startedAt);
  }

  return summarize(adapter, samples);
}

console.log("rust comments adapter comparison bench");
console.log("note: Outer fixtures are TODO; current CLI result is a test-process baseline");
console.log("\nrust comments adapter comparison: build cli release");

const cliBinaryPath = buildCli({ profile: "release" });
const cliEnvironment = {
  ...process.env,
  VIRGANOL_RUST_COMMENTS_CLI_PATH: cliBinaryPath,
};

console.log("\nrust comments adapter comparison: cli");
console.table([benchmarkAdapter("cli", cliEnvironment)]);

console.log("rust comments adapter comparison: napi TODO");
