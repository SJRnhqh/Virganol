import { useState, type ReactNode } from "react";
import { Rocket, Construction } from "lucide-react";
import { Sidebar } from "@/components/frame/Sidebar";
import { WindowHeader } from "@/components/frame/WindowHeader/WindowHeader";
import { NAV_ITEMS } from "@/config/navigation";
import { DevelopingView } from "@/components/frame/DevelopingView";
import { BotDashboard } from "@/features/bot/BotDashboard";
import { useSidebarStore } from "@/store/SidebarStore"; // 🟢 引入 Store
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  // 🟢 修改 1: 默认让用户进入 "scispirit" (Bot/MVP 界面)
  const [activeDeck, setActiveDeck] = useState("scispirit");

  // 🟢 获取侧边栏位置状态 (left | right)
  const { side } = useSidebarStore();

  const renderContent = () => {
    switch (activeDeck) {
      // 🟢 新增: SciSpirit (Bot) 是现在的主角
      case "scispirit":
        return <BotDashboard />;

      // 🟡 修改 2: SciApiary 暂时退居幕后，显示“开发中”
      case "sciapiary":
        return (
          <div className="w-full h-full pl-24 pt-6">
            <DevelopingView
              title="SciApiary (Orchestration Hub)"
              icon={Construction} // 用个施工图标提示自己
            />
          </div>
        );

      default: {
        const config = NAV_ITEMS.find((i) => i.id === activeDeck);
        return (
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
      {/* 1. 顶栏 (Header) - 固定高度 */}
      {/* 这里的 WindowHeader 内部包含了 SidebarToggle */}
      <WindowHeader activeId={activeDeck} />

      {/* 2. 内容视口 (Viewport) - 弹性布局区域 */}
      <div
        className={cn(
          "relative flex-1 w-full h-full overflow-hidden flex",
          // 🟢 智能方向控制：
          // - Left 模式: Sidebar 在左，内容在右 (flex-row)
          // - Right 模式: Sidebar 在右，内容在左 (flex-row-reverse)
          side === "left" ? "flex-row" : "flex-row-reverse"
        )}
      >
        {/* Sidebar: 现在作为 Flex Item 参与布局，不再绝对定位 */}
        <Sidebar activeId={activeDeck} onActiveIdChange={setActiveDeck} />

        {/* Main Stage: 自动占满剩余空间 (flex-1) */}
        {/* min-w-0 是 Flexbox 嵌套滚动的关键 hack，防止内容撑破容器 */}
        <main className="flex-1 h-full bg-main-bg isolate relative min-w-0 duration-300">
          <div className="w-full h-full z-0">{renderContent()}</div>

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