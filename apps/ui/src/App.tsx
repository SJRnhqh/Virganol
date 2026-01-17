import { MainLayout } from "./layouts/MainLayout";
import { CanvasWorkspace } from "./features/canvas/CanvasWorkspace";
import { SettingsDialog } from "./features/settings/SettingsDialog";
// 引入刚刚封装好的按钮组件
import { AddServerCard } from "./components/AddServerCard";

function App() {
  return (
    <MainLayout>
      {/* 1. 底层：无限画布 */}
      <CanvasWorkspace />

      {/* 2. 悬浮层：右下角添加按钮 (已封装，自带 fixed 定位) */}
      <AddServerCard />

      {/* 3. 弹窗层：设置窗口 (全局存在，默认隐藏) */}
      <SettingsDialog />
    </MainLayout>
  );
}

export default App;