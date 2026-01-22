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
  // 🟢 修改 1: 默认状态改为 "sciapiary" (对应 SciApiary 编排中枢)
  const [activeDeck, setActiveDeck] = useState("sciapiary");

  const renderContent = () => {
    switch (activeDeck) {
      // 🟢 修改 2: 匹配 SciApiary 的 ID
      case "sciapiary":
        // 这里依然使用 NodeDashboard 组件，因为 Apiary(养蜂场) 实际上就是展示 Node(节点/蜂箱) 的地方
        // 如果你愿意，未来可以把组件名也重构为 <SciApiaryDashboard />
        return <NodeDashboard />;
      
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