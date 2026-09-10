// apps/ui/src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import "./styles/index.css";

/** Mounts the React application into the document root.
 *
 * 将 React 应用挂载到文档根节点。
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
