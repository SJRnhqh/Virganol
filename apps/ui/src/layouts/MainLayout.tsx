import { type ReactNode } from "react";
import { Rocket, Construction } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // 🟢 引入动画增强隔离感
import { Sidebar } from "@/components/frame/Sidebar";
import { WindowHeader } from "@/components/frame/WindowHeader/WindowHeader";
import { NAV_ITEMS } from "@/config/navigation";
import { DevelopingView } from "@/components/frame/DevelopingView";
import { BotDashboard } from "@/features/bot/BotDashboard";
import { useSidebarStore } from "@/store/SidebarStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  useKeyboardShortcuts();

  // 🟢 统一使用 Store 状态，删除之前的本地 activeDeck
  const { side, activeId, setActiveId } = useSidebarStore();

  const renderContent = () => {
    // 💡 这里的 key={activeId} 非常关键，它告诉 React 这是一个全新的“隔离”页面
    switch (activeId) {
      case "scispirit":
        return <BotDashboard key="scispirit" />;

      case "sciapiary":
        return (
          <DevelopingView
            key="sciapiary"
            title="SciApiary (Orchestration Hub)"
            icon={Construction}
          />
        );

      default: {
        const config = NAV_ITEMS.find((i) => i.id === activeId);
        return (
          <DevelopingView
            key={activeId}
            title={config?.label || "Unknown Deck"}
            icon={config?.icon || Rocket}
          />
        );
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-main-bg text-primary">
      <WindowHeader activeId={activeId} />

      <div
        className={cn(
          "relative flex-1 w-full h-full overflow-hidden flex",
          side === "left" ? "flex-row" : "flex-row-reverse",
        )}
      >
        <Sidebar activeId={activeId} onActiveIdChange={setActiveId} />

        {/* 🟢 Main Stage: 容器隔离优化 */}
        <main className="flex-1 h-full bg-main-bg isolate relative min-w-0">
          {/* AnimatePresence 实现页面切换时的“静默消隐”
            mode="wait" 确保旧页面先消失，新页面再进入，实现物理隔离感
          */}
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              // 🟢 Initial: 新页面从微小的放大和透明开始（感觉是从屏幕外浮现）
              initial={{ opacity: 0, scale: 1.01, filter: "blur(4px)" }}
              
              // 🟢 Animate: 瞬间恢复原状
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              
              // 🟢 Exit: 旧页面微调缩小并消失（感觉是退入深处）
              exit={{ opacity: 0, scale: 0.98, filter: "blur(2px)" }}
              
              // 🚀 极速响应：使用 0.15s 的持续时间，让切换像快门一样利落
              transition={{ 
                duration: 0.15, 
                ease: [0.4, 0, 0.2, 1] // 标准的工业级缓动曲线
              }}
              className="w-full h-full p-6"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>

          {children}
        </main>
      </div>
    </div>
  );
}