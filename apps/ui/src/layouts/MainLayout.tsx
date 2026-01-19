import { useState, type ReactNode } from "react";
import { Rocket } from "lucide-react";
import { Sidebar } from "@/components/frame/Sidebar";
import { WindowHeader } from "@/components/frame/WindowHeader";
import { NAV_ITEMS } from "@/config/navigation";
import { DevelopingView } from "@/components/frame/DevelopingView";
import { NodeDashboard } from "@/features/node/NodeDashboard";
// 引入终端工作区
import { TerminalWorkspace } from "@/features/terminal/TerminalWorkspace";

// 定义哪些 Deck 允许显示终端
// 逻辑：只有在这些视图下，终端才可见。切换到其他视图时，终端隐藏但保持后台运行。
const TERMINAL_COMPATIBLE_DECKS = ["nodes"];

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

  // 计算当前是否应该显示终端
  // 如果当前 activeDeck 在白名单内，显示；否则隐藏 (display: none)
  const showTerminal = TERMINAL_COMPATIBLE_DECKS.includes(activeDeck);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-main-bg text-primary">
      {/* 🟢 1. 顶栏 (Header) - 永远可见 */}
      <WindowHeader activeId={activeDeck} />

      <div className="flex flex-1 overflow-hidden w-full relative">
        {/* 🟢 2. 侧边栏 (Sidebar) - 永远可见 */}
        <Sidebar activeId={activeDeck} onActiveIdChange={setActiveDeck} />

        {/* 🟢 3. 主舞台 (Main Stage) */}
        <main className="flex-1 relative min-w-0 isolate bg-main-bg">
          {/* --- Layer 0：业务视图层 --- */}
          <div className="absolute inset-0 overflow-hidden z-0">
            {renderContent()}
          </div>

          {/* --- Layer 1：全局终端层 --- */}
          {/* 使用 hidden 类来控制显隐，而不是条件渲染 (Conditional Rendering)。
              这样切换 Deck 时组件不会被销毁，保持连接和任务运行。
           */}
          <div className={showTerminal ? "contents" : "hidden"}>
            <TerminalWorkspace />
          </div>

          {/* --- Layer 2：全局弹窗/子元素层 --- */}
          {/* z-50 确保覆盖终端和业务层 */}
          <div className="relative z-50 pointer-events-none">
            {/* pointer-events-none 确保这层容器不挡鼠标，内部元素开启 pointer-events-auto */}
            <div className="pointer-events-auto">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}