import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginTailwindcss } from "@rsbuild/plugin-tailwindcss";

export default defineConfig({
  plugins: [pluginReact(), pluginTailwindcss()],
  source: {
    entry: { index: "./src/main.tsx" },
    tsconfigPath: "./tsconfig.app.json",
  },
  html: { template: "./index.html" },
  output: {
    // Preserve the previous compiler targets.
    overrideBrowserslist: ["Chrome >= 107", "Edge >= 107", "Firefox >= 104", "Safari >= 16"],
    polyfill: "off",
  },
  server: { port: 5173, strictPort: true },
});
