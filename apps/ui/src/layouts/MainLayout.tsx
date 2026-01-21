import { useState, type ReactNode } from "react";
import { Rocket } from "lucide-react";
import { Sidebar } from "@/components/frame/Sidebar";
import { WindowHeader } from "@/components/frame/WindowHeader";
import { NAV_ITEMS } from "@/config/navigation";
import { DevelopingView } from "@/components/frame/DevelopingView";
// 引入 Node 业务入口
import { NodeDashboard } from "@/features/node/NodeDashboard";

interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  // 状态由 Layout 统一管控
  const [activeDeck, setActiveDeck] = useState("nodes");

  // 根据当前 activeDeck 渲染主内容
  const renderContent = () => {
    switch (activeDeck) {
      case "nodes":
        // 🌟 关键点：NodeDashboard 内部自己包含了 NodeCanvas 和 NodeTerminalDock
        // 切换到其他 Deck 时，NodeDashboard 会卸载，终端连接也会断开（符合预期）
        return <NodeDashboard />;
      
      default: {
        const config = NAV_ITEMS.find((i) => i.id === activeDeck);
        return (
          <DevelopingView
            title={config?.label || "Unknown Deck"}
            icon={config?.icon || Rocket}
          />
        );
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-main-bg text-primary">
      {/* 🟢 1. 顶栏 (Header) - 永远可见 */}
      <WindowHeader activeId={activeDeck} />

      <div className="flex flex-1 overflow-hidden w-full relative">
        {/* 🟢 2. 侧边栏 (Sidebar) - 永远可见 */}
        <Sidebar activeId={activeDeck} onActiveIdChange={setActiveDeck} />

        {/* 🟢 3. 主舞台 (Main Stage) */}
        <main className="flex-1 relative min-w-0 isolate bg-main-bg">
          
          {/* --- Layer 0：业务视图层 (Current Deck) --- */}
          {/* z-0: 确保位于最底层 */}
          <div className="absolute inset-0 overflow-hidden z-0">
            {renderContent()}
          </div>

          {/* --- Layer 1：全局弹窗/子元素层 (Overlays) --- */}
          {/* 这里放置 Toast、Global Modal 等需要覆盖一切的内容 */}
          {children && (
            <div className="relative z-50 pointer-events-none w-full h-full">
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