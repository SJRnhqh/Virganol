import { SshLogin } from "./features/ssh";

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050505] text-slate-300">
      {/* 背景光晕装饰 */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-125 h-75 bg-indigo-600/10 blur-[120px] pointer-events-none" />

      <main className="relative z-10 w-full flex flex-col items-center">
        <header className="mb-8 space-y-2">
          <h1 className="text-3xl font-light tracking-[0.2em] text-white uppercase">
            Virga<span className="font-bold text-indigo-500">nol</span>
          </h1>
          <div className="h-px w-12 bg-indigo-500/50 mx-auto" />
        </header>

        {/* 渲染功能模块 */}
        <SshLogin />
      </main>
    </div>
  );
}

export default App;
