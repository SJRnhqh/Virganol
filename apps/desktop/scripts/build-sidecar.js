// apps/desktop/scripts/build-sidecar.js
import { execSync, spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// --- Configuration ---
const BINARY_NAME = "virganol-agent"; // Go agent binary name
const GO_ENTRY_DIR = "../server/cmd/agent"; // Go entry directory relative to apps/desktop
const OUTPUT_DIR = "src-tauri/bin"; // Output directory for built binaries

// Resolve absolute paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DESKTOP_ROOT = path.resolve(__dirname, "..");

// Supported targets
// Format: [Rust/Tauri triple, GOOS, GOARCH, file extension]
const targets = [
  // Windows x64
  {
    target: "x86_64-pc-windows-msvc",
    goos: "windows",
    goarch: "amd64",
    ext: ".exe",
  },
  // macOS Apple Silicon (M1/M2)
  {
    target: "aarch64-apple-darwin",
    goos: "darwin",
    goarch: "arm64",
    ext: "",
  },
  // macOS Intel
  {
    target: "x86_64-apple-darwin",
    goos: "darwin",
    goarch: "amd64",
    ext: "",
  },
  // Linux x64
  {
    target: "x86_64-unknown-linux-gnu",
    goos: "linux",
    goarch: "amd64",
    ext: "",
  },
];

// 1) Ensure output directory exists
const binPath = path.join(DESKTOP_ROOT, OUTPUT_DIR);
if (!fs.existsSync(binPath)) {
  fs.mkdirSync(binPath, { recursive: true });
}

console.log(`🚀 Starting Go Agent build [${BINARY_NAME}]...`);
console.log(`   📂 Desktop root: ${DESKTOP_ROOT}`);
console.log(`   🧭 Go entry dir: ${path.resolve(DESKTOP_ROOT, GO_ENTRY_DIR)}`);
console.log(`   📁 Output dir:   ${binPath}`);

// 2) Determine selected targets (default: host platform only; override with --all or BUILD_ALL=1)
const buildAll =
  process.argv.includes("--all") || process.env.BUILD_ALL === "1";
let selectedTargets = targets;

if (!buildAll) {
  const key = `${process.platform}-${process.arch}`;
  const hostMap = {
    "win32-x64": {
      target: "x86_64-pc-windows-msvc",
      goos: "windows",
      goarch: "amd64",
      ext: ".exe",
    },

    "darwin-arm64": {
      target: "aarch64-apple-darwin",
      goos: "darwin",
      goarch: "arm64",
      ext: "",
    },
    "darwin-x64": {
      target: "x86_64-apple-darwin",
      goos: "darwin",
      goarch: "amd64",
      ext: "",
    },
    "linux-x64": {
      target: "x86_64-unknown-linux-gnu",
      goos: "linux",
      goarch: "amd64",
      ext: "",
    },
  };
  const m = hostMap[key];
  if (m) {
    selectedTargets = [m];
    console.log(
      `   🧠 Host detected: ${key} -> ${m.target} (${m.goos}/${m.goarch})`,
    );
  } else {
    console.log(`   ⚠️ Unsupported host "${key}", building all known targets.`);
  }
}

// 3) Build for each selected target
// Collect failures so we can fail the script after attempting all targets
const buildFailures = [];

selectedTargets.forEach((t) => {
  const { target, goos, goarch, ext } = t;
  const outputFile = path.join(binPath, `${BINARY_NAME}-${target}${ext}`);

  console.log(`   📦 Target: ${target} (${goos}/${goarch})`);

  try {
    // Build command using spawnSync with array args to avoid shell injection
    // -trimpath: remove file system paths for smaller, cleaner binaries
    // -ldflags "-s -w": strip debug symbols to reduce size
    const cwd = path.resolve(DESKTOP_ROOT, GO_ENTRY_DIR);
    const args = [
      "build",
      "-trimpath",
      "-ldflags",
      "-s -w",
      "-o",
      outputFile,
      ".",
    ];

    const result = spawnSync("go", args, {
      cwd,
      env: {
        ...process.env,
        CGO_ENABLED: "0", // Build as pure Go (static), most portable across platforms
        GOOS: goos,
        GOARCH: goarch,
      },
      stdio: "inherit", // Stream child process output
    });

    if (result.error) {
      throw result.error;
    }
    if (result.status !== 0) {
      throw new Error(`go build exited with status ${result.status}`);
    }

    console.log(`   ✅ Success: ${path.basename(outputFile)}`);
  } catch (error) {
    const reason = error?.message || String(error);
    console.error(`   ❌ Failed: ${target} (${goos}/${goarch})`);
    console.error(`      ↳ Reason: ${reason}`);

    // Collect failure for later reporting
    buildFailures.push({
      target,
      goos,
      goarch,
      error,
    });
  }
});

// 4) Report results and fail if necessary
if (buildFailures.length > 0) {
  console.error("\n❌ Sidecar build completed with failures:");
  for (const failure of buildFailures) {
    console.error(
      `   - ${failure.target} (${failure.goos}/${failure.goarch}): ${failure.error.message || failure.error}`,
    );
  }

  // Fail CI / production builds so missing binaries are detected
  if (process.env.NODE_ENV === "production" || process.env.CI === "true") {
    console.error(
      "\n🚨 Production/CI build detected: failing due to incomplete sidecar builds.",
    );
    process.exit(1);
  } else {
    console.warn(
      "\n⚠️ Non-production build: continuing despite sidecar build failures.",
    );
  }
} else {
  console.log("🎉 All Go Agent builds completed successfully!\n");
}
