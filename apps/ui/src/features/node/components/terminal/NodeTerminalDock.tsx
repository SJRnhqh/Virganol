import { useTerminalStore } from "../../store/TerminalStore";
import {
  Maximize2,
  Minimize2,
  X,
  Terminal as TerminalIcon,
  ChevronRight,
} from "lucide-react";
import { clsx } from "clsx";
import { NodeTerminal } from "./NodeTerminal";

export const NodeTerminalDock = () => {
  const {
    sessions,
    activeSessionId,
    switchSession,
    closeTerminal,
    isMaximized,
    toggleMaximize,
    minimize, // 这里的 minimize 实际上就是 Close/Hide
  } = useTerminalStore();

  if (!activeSessionId || sessions.length === 0) return null;

  return (
    <div
      className={clsx(
        "flex flex-col h-full w-full overflow-hidden bg-[#1e1e1e]/95 backdrop-blur-md border border-white/10",
        // 如果不是最大化，给窗口加圆角；最大化则直角
        isMaximized ? "rounded-none" : "rounded-xl",
      )}
    >
      {/* 🟢 Header: 拖拽区/工具栏 */}
      <div
        className="flex items-center justify-between h-10 px-3 bg-[#252525] border-b border-black/50 select-none shrink-0"
        onDoubleClick={toggleMaximize} // 双击标题栏切换最大化
      >
        {/* 左侧：Tabs */}
        <div
          className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[70%]"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {sessions.map((s, idx) => (
            <div key={s.nodeId} className="flex items-center group">
              {idx > 0 && (
                <ChevronRight size={14} className="text-gray-600 mx-1" />
              )}
              <button
                onClick={() => switchSession(s.nodeId)}
                className={clsx(
                  "flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono border transition-all",
                  s.nodeId === activeSessionId
                    ? "bg-[#333] text-green-400 border-green-900/30 shadow-sm"
                    : "text-gray-500 border-transparent hover:text-gray-300 hover:bg-[#333]",
                )}
              >
                <TerminalIcon size={12} />
                <span className="truncate max-w-30">{s.name || s.nodeId}</span>
                <X
                  size={12}
                  className="ml-1.5 opacity-0 group-hover:opacity-100 hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTerminal(s.nodeId);
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        {/* 右侧：窗口控制按钮组 */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-white/5">
          {/* 最大化/还原 */}
          <button
            onClick={toggleMaximize}
            className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          {/* 关闭/退出 (其实是隐藏窗口) */}
          <button
            onClick={minimize} // Store 里的 minimize 是 set isOpen = false
            className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-md text-gray-400 transition-colors"
            title="Close Terminal"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* 🟢 Body: 终端内容 */}
      <div className="flex-1 bg-black/90 relative">
        <NodeTerminal
          key={activeSessionId}
          nodeId={activeSessionId}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};
