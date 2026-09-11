// apps/ui/rsbuild.config.ts
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginTailwindcss } from "@rsbuild/plugin-tailwindcss";

/**
 * Rsbuild build config.
 *
 * Rsbuild 构建配置。
 */
export default defineConfig({
  plugins: [pluginReact(), pluginTailwindcss()],
  source: {
    entry: { index: "./src/main.tsx" },
    tsconfigPath: "./tsconfig.app.json",
  },
  html: { template: "./index.html" },
  server: { strictPort: true },
});
