import { useState, type ReactNode } from "react";
import { Rocket } from "lucide-react";
import { Sidebar } from "@/components/frame/Sidebar";
import { WindowHeader } from "@/components/frame/WindowHeader/WindowHeader";
import { NAV_ITEMS } from "@/config/navigation";
import { DevelopingView } from "@/components/frame/DevelopingView";
import { NodeDashboard } from "@/features/node/NodeDashboard";

interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [activeDeck, setActiveDeck] = useState("nodes");

  const renderContent = () => {
    switch (activeDeck) {
      case "nodes":
        return <NodeDashboard />;
      default: {
        const config = NAV_ITEMS.find((i) => i.id === activeDeck);
        return (
          // ⚠️ 注意：非 Canvas 的页面（如文字页面），
          // 需要自己加 pl-24 (padding-left) 来避开悬浮的 Sidebar，
          // 否则文字会被遮住。NodeDashboard 是全屏画布所以不需要。
          <div className="w-full h-full pl-24 pt-6">
            <DevelopingView
              title={config?.label || "Unknown Deck"}
              icon={config?.icon || Rocket}
            />
          </div>
        );
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-main-bg text-primary">
      {/* 🟢 1. 顶栏 (Header) - 占据顶部固定高度 */}
      <WindowHeader activeId={activeDeck} />

      {/* 🟢 2. 内容视口 (Viewport) */}
      {/* relative: 极其重要！确立 Sidebar 的定位坐标系 */}
      {/* flex-1: 占满剩余高度 */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* 🚀 侧边栏 (Sidebar) - 悬浮层 */}
        {/* 由于我们在 Sidebar 组件里写了 absolute + z-40，
            它会自动浮在 Main Stage 之上，且垂直居中 */}
        <Sidebar activeId={activeDeck} onActiveIdChange={setActiveDeck} />

        {/* 🎨 主舞台 (Main Stage) - 底层 */}
        {/* w-full h-full: 强制占满整个视口，包括 Sidebar 下方的区域 */}
        <main className="w-full h-full bg-main-bg isolate">
          {/* Layer 0：业务视图层 */}
          {/* z-0: 确保位于最底层 */}
          <div className="w-full h-full z-0">{renderContent()}</div>

          {/* Layer 1：全局弹窗/子元素层 */}
          {children && (
            <div className="absolute inset-0 z-50 pointer-events-none">
              <div className="pointer-events-auto w-full h-full">
                {children}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
