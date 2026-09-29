// apps/ui/src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/styles/index.css";
import App from "./App";

/** Mounts the application by rendering its root component.
 *
 * 渲染根组件以挂载应用。
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
