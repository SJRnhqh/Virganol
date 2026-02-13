import { MainLayout } from "@/layouts/MainLayout";
import { useProviderStartup } from "@/features/bot/hooks";

function App() {
  useProviderStartup();
  return <MainLayout></MainLayout>;
}

export default App;