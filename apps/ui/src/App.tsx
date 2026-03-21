// apps/ui/src/App.tsx
// 内部引用
import { useProviderStartup } from "./features";
import { MainLayout } from "./layouts";

function App() {
  useProviderStartup();
  return <MainLayout></MainLayout>;
}

export default App;
