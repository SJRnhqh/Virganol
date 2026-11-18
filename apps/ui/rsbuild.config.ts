// apps/ui/rsbuild.config.ts
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginTailwindcss } from "@rsbuild/plugin-tailwindcss";
import stylex from "@stylexjs/unplugin";

/**
 * Rsbuild build config.
 *
 * Rsbuild 构建配置。
 */
export default defineConfig(({ env }) => ({
  plugins: [pluginReact(), pluginTailwindcss()],
  tools: {
    swc: { jsc: { transform: { verbatimModuleSyntax: true } } },
    rspack: {
      plugins: [
        stylex.rspack({
          sxPropName: false,
          runtimeInjection: env === "development",
          useCSSLayers: true,
        }),
      ],
    },
  },
  source: {
    entry: { index: "./src/main.tsx" },
    tsconfigPath: "./tsconfig.app.json",
  },
  html: { template: "./index.html" },
  server: { strictPort: true },
}));
