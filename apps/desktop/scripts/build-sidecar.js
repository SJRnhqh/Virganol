// apps/desktop/scripts/build-sidecar.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuration ---
const BINARY_NAME = 'virganol-agent'; // Go agent binary name
const GO_ENTRY_DIR = '../server/cmd/agent'; // Go entry directory relative to apps/desktop
const OUTPUT_DIR = 'src-tauri/bin'; // Output directory for built binaries

// Resolve absolute paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DESKTOP_ROOT = path.resolve(__dirname, '..');

// Supported targets
// Format: [Rust/Tauri triple, GOOS, GOARCH, file extension]
const targets = [
  // Windows x64
  {
    target: 'x86_64-pc-windows-msvc',
    goos: 'windows',
    goarch: 'amd64',
    ext: '.exe',
  },
  // macOS Apple Silicon (M1/M2)
  {
    target: 'aarch64-apple-darwin',
    goos: 'darwin',
    goarch: 'arm64',
    ext: '',
  },
  // macOS Intel
  {
    target: 'x86_64-apple-darwin',
    goos: 'darwin',
    goarch: 'amd64',
    ext: '',
  },
  // Linux x64
  {
    target: 'x86_64-unknown-linux-gnu',
    goos: 'linux',
    goarch: 'amd64',
    ext: '',
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

// 2) Build for each target
targets.forEach((t) => {
  const { target, goos, goarch, ext } = t;
  const outputFile = path.join(binPath, `${BINARY_NAME}-${target}${ext}`);

  console.log(`   📦 Target: ${target} (${goos}/${goarch})`);

  try {
    // Core build command
    // -trimpath: remove file system paths for smaller, cleaner binaries
    // -ldflags "-s -w": strip debug symbols to reduce size
    const cmd = `go build -trimpath -ldflags "-s -w" -o "${outputFile}" .`;
    const cwd = path.resolve(DESKTOP_ROOT, GO_ENTRY_DIR);

    execSync(cmd, {
      cwd,
      env: {
        ...process.env,
        CGO_ENABLED: '0', // Build as pure Go (static), most portable across platforms
        GOOS: goos,
        GOARCH: goarch,
      },
      stdio: 'inherit', // Stream child process output
    });

    console.log(`   ✅ Success: ${path.basename(outputFile)}`);
  } catch (error) {
    const reason = error?.message || String(error);
    console.error(`   ❌ Failed: ${target} (${goos}/${goarch})`);
    console.error(`      ↳ Reason: ${reason}`);
    // Optionally fail fast:
    // process.exit(1);
  }
});

console.log('🎉 All Go Agent builds completed!\n');
