import React from "react";
import { WindowHeader } from "../components/window/WindowHeader";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#FAF7F0] text-[#2F3E46]">
      {/* 使用封装好的组件 */}
      <WindowHeader />

      <main className="flex-1 relative overflow-hidden">
        <div className="relative w-full h-full z-10">{children}</div>
      </main>
    </div>
  );
}
