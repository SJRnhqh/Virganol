interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-indigo-500/30 overflow-hidden">
      {/* 1. 全局背景装饰 - 保持视觉统一 */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-125 h-75 bg-indigo-600/10 blur-[120px] pointer-events-none" />

      {/* 2. 主容器 */}
      <main className="relative z-10 w-full flex flex-col items-center">
        {/* 3. 品牌头部 - 无论切到哪个功能，这个 Header 都在 */}
        <header className="mb-10 space-y-2 text-center">
          <h1 className="text-3xl font-light tracking-[0.2em] text-white uppercase">
            Virga<span className="font-bold text-indigo-500">nol</span>
          </h1>
          <div className="h-px w-12 bg-indigo-500/50 mx-auto" />
        </header>

        {/* 4. 动态内容区 - 这里会渲染具体的 Feature (如 SSH 登录) */}
        {children}
      </main>
    </div>
  );
}
