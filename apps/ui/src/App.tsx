// apps/ui/src/App.tsx
import type { JSX } from "react";

import { useProviderStartup } from "@/features";
import { MainLayout } from "@/layouts";

/** Root component of the application.
 *
 * 应用的根组件。
 */
export default function App(): JSX.Element {
  useProviderStartup();
  return <MainLayout />;
}
