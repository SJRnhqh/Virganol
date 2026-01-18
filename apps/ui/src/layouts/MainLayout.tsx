import React from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { WindowHeader } from "../components/window/WindowHeader";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    // 最外层：左右横向布局 (row)
    <div className="flex flex-row h-screen w-screen overflow-hidden bg-[#FAF7F0]">
      {/* 1. 左侧侧边栏 (固定宽度, 全高) */}
      <Sidebar />

      {/* 2. 右侧主内容区 (自适应宽度) */}
      <div className="flex-1 flex flex-col h-full relative min-w-0">
        {/* 右侧顶部：极简信息条 + Windows控制按钮 */}
        <WindowHeader />

        {/* 核心工作区 (Canvas 等) */}
        <main className="flex-1 relative w-full overflow-hidden">
          {/* 绝对定位层，确保内容撑满 */}
          <div className="absolute inset-0 z-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
