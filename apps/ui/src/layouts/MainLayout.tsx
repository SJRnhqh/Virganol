import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#FAF7F0] text-[#2F3E46]">
      {/* 顶栏 */}
      <header className="h-10 w-full flex items-center px-6 bg-[#84A59D] border-b border-[#E6E1D3] z-50 shrink-0 shadow-sm relative">
        <div className="flex items-center gap-2 select-none">
          <div className="w-4 h-4 bg-[#2F3E46] rounded-sm flex items-center justify-center rotate-45">
            <span className="text-[9px] font-bold text-[#FAF7F0] -rotate-45 font-mono">
              V
            </span>
          </div>
          <h1 className="text-[10px] font-black tracking-[0.3em] text-white uppercase italic">
            Virga<span className="opacity-60">nol</span>
          </h1>
        </div>
      </header>

      {/* ⚠️ 关键点：这里必须是 flex-1 和 relative，不能有 p-8 或 items-center */}
      <main className="flex-1 relative overflow-hidden">
        {/* 这一层保证 Canvas 拿满宽高 */}
        <div className="relative w-full h-full z-10">{children}</div>
      </main>
    </div>
  );
}
