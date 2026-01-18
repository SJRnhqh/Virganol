import { useState, type ReactNode } from "react";
import { Rocket } from "lucide-react";
import { Sidebar } from "@/components/frame/Sidebar";
import { WindowHeader } from "@/components/frame/WindowHeader";
import { NAV_ITEMS } from "@/config/navigation";
import { DevelopingView } from "@/components/frame/DevelopingView";
import { SshDashboard } from "@/features/ssh/SshDashboard";

// 注意：这里去掉了 export 关键字，防止触发 Fast Refresh 警告
interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  // 状态由 Layout 统一管控，下发给 Header 和 Sidebar
  const [activeDeck, setActiveDeck] = useState("nodes");

  const renderContent = () => {
    switch (activeDeck) {
      case "nodes":
        // Node 模块的所有逻辑（Canvas, AddServerCard）都封装在这里
        return <SshDashboard />;
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
      {/* 顶栏：同步 Breadcrumbs */}
      <WindowHeader activeId={activeDeck} />

      <div className="flex flex-1 overflow-hidden w-full relative">
        {/* 侧边栏：同步切换图标状态 */}
        <Sidebar activeId={activeDeck} onActiveIdChange={setActiveDeck} />

        <main className="flex-1 relative min-w-0 isolate bg-main-bg">
          {/* 第一层：业务视图层（如 Canvas） */}
          <div className="absolute inset-0 overflow-hidden">
            {renderContent()}
          </div>

          {/* 第二层：全局弹窗叠加层（如 SettingsDialog） */}
          {/* 确保 z-index 足够高以覆盖内容 */}
          <div className="relative z-50">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}