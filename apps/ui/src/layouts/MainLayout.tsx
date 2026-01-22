import { useState, type ReactNode } from "react";
import { Rocket, Construction } from "lucide-react"; // 🟢 新增 Construction 图标用于施工状态
import { Sidebar } from "@/components/frame/Sidebar";
import { WindowHeader } from "@/components/frame/WindowHeader/WindowHeader";
import { NAV_ITEMS } from "@/config/navigation";
import { DevelopingView } from "@/components/frame/DevelopingView";
// import { NodeDashboard } from "@/features/node/NodeDashboard"; // 🔴 暂时注释掉，不再直接引用
import { BotDashboard } from "@/features/bot/BotDashboard"; // 🟢 引入 BotDashboard

interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  // 🟢 修改 1: 默认让用户进入 "scispirit" (Bot/MVP 界面)
  const [activeDeck, setActiveDeck] = useState("scispirit");

  const renderContent = () => {
    switch (activeDeck) {
      // 🟢 新增: SciSpirit (Bot) 是现在的主角
      case "scispirit":
        return <BotDashboard />;

      // 🟡 修改 2: SciApiary 暂时退居幕后，显示“开发中”
      case "sciapiary":
        // return <NodeDashboard />; // 原来的编排看板先藏起来
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
      <WindowHeader activeId={activeDeck} />

      <div className="relative flex-1 w-full h-full overflow-hidden">
        <Sidebar activeId={activeDeck} onActiveIdChange={setActiveDeck} />

        <main className="w-full h-full bg-main-bg isolate">
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