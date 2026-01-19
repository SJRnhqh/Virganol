import { useTerminalStore } from "@/store/TerminalStore";
import { XTerm } from "@/components/terminal/XTerm";
import {
  Maximize2,
  Minimize2,
  X,
  Terminal as TerminalIcon,
  ChevronRight,
  Minus,
} from "lucide-react";
import { clsx } from "clsx";

export const TerminalWorkspace = () => {
  const {
    isOpen,
    isMaximized,
    sessions,
    activeSessionId,
    switchSession,
    closeTerminal,
    toggleMaximize,
    minimize,
  } = useTerminalStore();

  if (!isOpen) return null;

  return (
    <div
      className={clsx(
        "absolute z-50 flex flex-col overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]",
        "bg-charcoal/95 backdrop-blur-xl border border-white/10 shadow-2xl",
        isMaximized
          ? "inset-0 rounded-none border-0" // 全屏
          : "bottom-8 left-1/2 -translate-x-1/2 w-200 h-125 rounded-xl border-t border-white/20", // 悬浮窗
      )}
    >
      {/* --- 顶部导航栏 --- */}
      <div className="flex items-center justify-between h-10 px-4 bg-black/40 border-b border-white/5 select-none shrink-0">
        {/* 面包屑区域 */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {sessions.map((session, index) => {
            const isActive = session.nodeId === activeSessionId;
            return (
              <div key={session.nodeId} className="flex items-center group">
                {index > 0 && (
                  <ChevronRight size={14} className="text-white/20 mx-1" />
                )}
                <button
                  onClick={() => switchSession(session.nodeId)}
                  className={clsx(
                    "flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono transition-all border",
                    isActive
                      ? "bg-forest/20 text-emerald-400 border-emerald-500/30"
                      : "text-sage/60 border-transparent hover:text-white hover:bg-white/5",
                  )}
                >
                  <TerminalIcon size={12} />
                  {session.name}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTerminal(session.nodeId);
                    }}
                    className="ml-1.5 p-0.5 rounded-full hover:bg-red-500/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* 窗口控制按钮 */}
        <div className="flex items-center gap-3 ml-4">
          <button
            onClick={minimize}
            className="text-sage/50 hover:text-white transition-colors"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={toggleMaximize}
            className="text-sage/50 hover:text-white transition-colors"
          >
            {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* --- 终端渲染区 --- */}
      <div className="flex-1 bg-black/80 relative overflow-hidden p-1">
        {/* 关键：使用 key={activeSessionId} 强制 React 在切 Tab 时重新挂载 XTerm 组件 */}
        {/* 这样可以确保每个 Tab 连接到正确的 nodeId */}
        {activeSessionId && (
          <XTerm
            key={activeSessionId}
            nodeId={activeSessionId}
            className="w-full h-full"
          />
        )}
      </div>
    </div>
  );
};
