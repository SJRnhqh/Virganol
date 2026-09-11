// apps/ui/src/App.tsx
import { useProviderStartup } from "./features";
import { MainLayout } from "./layouts";

/** Initializes the application shell and its startup lifecycle.
 *
 * 初始化应用外壳及其启动生命周期。
 */
export default function App() {
  useProviderStartup();
  return <MainLayout />;
}
