// apps/ui/src/App.tsx
import { useProviderStartup } from "./features";
import { MainLayout } from "./layouts";

/** Root component of the application.
 *
 * 应用的根组件。
 */
export default function App() {
  useProviderStartup();
  return <MainLayout />;
}
