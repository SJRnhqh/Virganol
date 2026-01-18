import { useState } from "react";
import { Rocket } from "lucide-react";
import { Sidebar } from "@/components/frame/Sidebar";
import { WindowHeader } from "@/components/frame/WindowHeader";
import { NAV_ITEMS } from "@/config/navigation";
import { DevelopingView } from "@/components/frame/DevelopingView";
import { SshDashboard } from "@/features/ssh";

export function MainLayout() {
  // 初始状态设为 nodes，聚焦 Node Lab 开发
  const [activeDeck, setActiveDeck] = useState("nodes");

  const renderContent = () => {
    switch (activeDeck) {
      // 核心开发区域：Node Lab
      case "nodes":
        return <SshDashboard />;

      // 其他模块统一使用带有酿造感文案的占位视图
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
      {/* 🔴 传入 activeId 以驱动顶栏面包屑动态更新 */}
      <WindowHeader activeId={activeDeck} />

      <div className="flex flex-1 overflow-hidden w-full relative">
        {/* 受控侧边栏 */}
        <Sidebar activeId={activeDeck} onActiveIdChange={setActiveDeck} />

        <main className="flex-1 relative min-w-0 isolate bg-main-bg">
          <div className="absolute inset-0 overflow-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
