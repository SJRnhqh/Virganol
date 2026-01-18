import { useState } from "react";
import { Rocket } from "lucide-react";
import { Sidebar } from "@/components/frame/Sidebar";
import { WindowHeader } from "@/components/frame/WindowHeader";
import { NAV_ITEMS } from "@/config/navigation";
import { DevelopingView } from "@/components/frame/DevelopingView";
import { SshDashboard } from "@/features/ssh";

export function MainLayout() {
  // 初始状态设为 nodes，方便你直接开发 Node Lab
  const [activeDeck, setActiveDeck] = useState("nodes");

  const renderContent = () => {
    switch (activeDeck) {
      // 核心开发区域：Node Lab (Network Orchestration)
      case "nodes":
        return <SshDashboard />;

      // 其他所有 Decks (包括 bot, workflow, vault 等) 统一使用蒙混过关视图
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
      {/* 顶部标题栏 - 接下来可以在这里做面包屑 */}
      <WindowHeader />

      <div className="flex flex-1 overflow-hidden w-full relative">
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
