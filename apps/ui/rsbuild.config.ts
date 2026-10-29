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
    rspack: {
      plugins: [
        // TBD: 0.19.1 的 Rspack 适配器漏挂 CSS 输出钩子，暂用 Webpack 兼容入口；关注包含 #1745 修复的正式版本，升级并验证 CSS 输出与热更新后切回 .rspack()。
        // https://github.com/facebook/stylex/pull/1745
        stylex.webpack({
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
