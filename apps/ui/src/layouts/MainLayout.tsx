import React from "react";
import { Sidebar } from "@/components/frame/Sidebar";
import { WindowHeader } from "@/components/frame/WindowHeader";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-main-bg text-primary">
      {/* 1. 顶栏 */}
      <WindowHeader />

      {/* 2. 下方内容容器 */}
      <div className="flex flex-1 overflow-hidden w-full relative">
        {/* 2.1 侧边栏 */}
        <Sidebar />

        {/* 2.2 主页面 */}
        <main className="flex-1 relative min-w-0 bg-main-bg">
          <div className="absolute inset-0 overflow-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
