interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden select-none bg-[#FAF7F0]">
      {/* 1. 极简顶栏 */}
      <header className="h-10 w-full flex items-center px-6 bg-[#84A59D] border-b border-[#E6E1D3] z-50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#2F3E46] rounded-sm flex items-center justify-center rotate-45">
            <span className="text-[9px] font-bold text-[#FAF7F0] -rotate-45 font-mono">V</span>
          </div>
          <h1 className="text-[10px] font-black tracking-[0.3em] text-white uppercase italic">
            Virga<span className="opacity-60">nol</span>
          </h1>
        </div>
      </header>

      {/* 2. 背景纹理（微弱纸张感） */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }} />

      {/* 3. 核心工作区 (Workplace) */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* 这里预留左侧工具栏 (Sidebar) 占位符，暂时不显示，但结构留好 */}
        {/* <aside className="w-12 border-r border-[#E6E1D3] bg-white/10" /> */}

        <main className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
          {/* 这里的 max-w-5xl 确保内容不会被无限拉宽 */}
          <div className="w-full max-w-5xl flex flex-col items-center">
             {children}
          </div>
        </main>

        {/* 这里预留右侧 AI/信息栏 (Context Panel) 占位符 */}
        {/* <aside className="w-64 border-l border-[#E6E1D3] bg-white/10" /> */}
      </div>
    </div>
  );
}