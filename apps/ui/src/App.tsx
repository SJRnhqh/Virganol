import { MainLayout } from "@/layouts/MainLayout";
import { SettingsDialog } from "@/features/settings/SettingsDialog";

function App() {
  return (
    <MainLayout>
      {/* 只放置真正的全局组件 */}
      <SettingsDialog />
    </MainLayout>
  );
}

export default App;