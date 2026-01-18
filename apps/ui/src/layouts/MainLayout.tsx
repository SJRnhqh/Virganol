import React from "react";
import { Sidebar } from "@/components/frame/Sidebar";
import { WindowHeader } from "@/components/frame/WindowHeader";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    // 1. 改变主轴方向：flex-col (垂直排列)
    // 这样 WindowHeader 就会占据第一行，Sidebar 和 Main 占据第二行
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-main-bg text-primary transition-colors duration-300">
      {/* Top: 全宽的 Header (包含左上角红绿灯背景 + 右侧控制条) */}
      <WindowHeader />

      {/* Bottom: Sidebar + Content 并排 */}
      <div className="flex flex-1 overflow-hidden w-full relative">
        {/* Left: 纯净的 Sidebar */}
        <Sidebar />

        {/* Right: 内容区 */}
        <main className="flex-1 relative w-full h-full min-w-0 isolate">
          <div className="absolute inset-0 z-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
