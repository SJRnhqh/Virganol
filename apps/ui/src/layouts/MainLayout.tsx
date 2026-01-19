/* apps/ui/src/layouts/MainLayout.tsx */
import { useState, type ReactNode } from "react";
import { Rocket } from "lucide-react";
import { Sidebar } from "@/components/frame/Sidebar";
import { WindowHeader } from "@/components/frame/WindowHeader";
import { NAV_ITEMS } from "@/config/navigation";
import { DevelopingView } from "@/components/frame/DevelopingView";
import { NodeDashboard } from "@/features/node/NodeDashboard";
// 🌟 1. 引入终端工作区
import { TerminalWorkspace } from "@/features/terminal/TerminalWorkspace";

interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  // 状态由 Layout 统一管控
  const [activeDeck, setActiveDeck] = useState("nodes");

  const renderContent = () => {
    switch (activeDeck) {
      case "nodes":
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
      {/* 顶栏 */}
      <WindowHeader activeId={activeDeck} />

      <div className="flex flex-1 overflow-hidden w-full relative">
        {/* 侧边栏 */}
        <Sidebar activeId={activeDeck} onActiveIdChange={setActiveDeck} />

        <main className="flex-1 relative min-w-0 isolate bg-main-bg">
          {/* --- 层级 0：业务视图层 --- */}
          <div className="absolute inset-0 overflow-hidden z-0">
            {renderContent()}
          </div>

          {/* --- 层级 1：全局终端层 (新增) --- */}
          {/* 🌟 把它放在这里！它是全局的，不随 activeDeck 切换而销毁 */}
          {/* TerminalWorkspace 内部自己决定显示/隐藏，不需要外部条件判断 */}
          <TerminalWorkspace />

          {/* --- 层级 2：全局弹窗/子元素层 --- */}
          {/* 确保 z-index 最高，如果有 Modal 应该盖住终端 */}
          <div className="relative z-50 pointer-events-none">
            {/* pointer-events-none 确保这层 div 本身不挡鼠标，子元素开启 pointer-events-auto */}
            <div className="pointer-events-auto">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
