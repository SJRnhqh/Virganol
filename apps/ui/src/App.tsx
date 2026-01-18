import { MainLayout } from "./layouts/MainLayout";
import { CanvasWorkspace } from "./features/canvas/CanvasWorkspace";
import { SettingsDialog } from "./features/settings/SettingsDialog";
import { AddServerCard } from "./components/AddServerCard";

function App() {
  return (
    <MainLayout>
      {/* Node Deck */}
      <CanvasWorkspace />

      {/* 悬浮交互层 */}
      <AddServerCard />

      {/* 全局弹窗层 */}
      <SettingsDialog />
    </MainLayout>
  );
}

export default App;
