import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // 防止端口冲突：强制使用 5173 端口，如果被占用则报错
  server: {
    port: 5173,
    strictPort: true,
  },
});
