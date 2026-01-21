import { useTerminalStore } from "@/store/TerminalStore";
import { Maximize2, Minimize2, X, Terminal as TerminalIcon, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
// 引入刚才写好的业务组件
import { NodeTerminal } from "./NodeTerminal"; 

export const NodeTerminalDock = () => {
  // 1. 从 Store 获取状态
  const { 
    sessions, 
    activeSessionId, 
    switchSession, 
    closeTerminal, 
    isMaximized,
    toggleMaximize
  } = useTerminalStore();

  // 如果没有激活的会话，或者会话列表为空，直接隐藏
  if (!activeSessionId || sessions.length === 0) return null;

  return (
    <div
      className={clsx(
        "flex flex-col bg-[#1e1e1e] border-t border-black shadow-2xl transition-all duration-300 ease-in-out",
        // 样式逻辑：
        // isMaximized -> 绝对定位撑满父容器 (NodeDashboard)
        // !isMaximized -> 默认高度 (父容器通过 flex 或 height 控制)
        isMaximized ? "absolute inset-0 z-50 h-full" : "h-full w-full"
      )}
    >
      {/* 🟢 顶部工具栏 (Header) */}
      <div 
        className="flex items-center justify-between h-9 px-3 bg-[#2d2d2d] border-b border-black select-none shrink-0"
        onDoubleClick={toggleMaximize}
      >
        {/* 左侧：标签页 (Tabs) */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[80%]" onMouseDown={e => e.stopPropagation()}>
          {sessions.map((s, idx) => (
            <div key={s.nodeId} className="flex items-center group">
              {/* 分隔符 */}
              {idx > 0 && <ChevronRight size={14} className="text-gray-600 mx-1" />}
              
              {/* 标签按钮 */}
              <button 
                onClick={() => switchSession(s.nodeId)} 
                className={clsx(
                  "flex items-center gap-2 px-2 py-0.5 rounded text-xs font-mono border transition-all",
                  s.nodeId === activeSessionId 
                    ? "bg-gray-700 text-green-400 border-gray-600" // 激活态
                    : "text-gray-500 border-transparent hover:text-gray-300 hover:bg-gray-800" // 默认态
                )}
              >
                <TerminalIcon size={12} /> 
                <span className="truncate max-w-37.5">{s.name || s.nodeId}</span>
                
                {/* 关闭按钮 (Hover 显示) */}
                <X 
                  size={10} 
                  className="ml-1.5 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity" 
                  onClick={(e) => { 
                    e.stopPropagation(); // 防止触发 switchSession
                    closeTerminal(s.nodeId); 
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        {/* 右侧：窗口控制按钮 */}
        <div className="flex items-center gap-2">
           <button
            onClick={toggleMaximize}
            className="p-1 hover:bg-gray-600 rounded text-gray-400 hover:text-white transition-colors"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>
        </div>
      </div>

      {/* 🟢 内容区域 (Body) */}
      <div className="flex-1 bg-black overflow-hidden relative">
        {/* 渲染业务终端组件 
          key={activeSessionId} 是关键：
          它告诉 React 当切换标签时，这是一个全新的组件，需要重新走 usePtySession 的连接逻辑。
          如果不加 key，React 会复用组件实例，导致 nodeId 变了但 xterm 实例没清空，可能会有显示 bug。
        */}
        <NodeTerminal 
          key={activeSessionId}
          nodeId={activeSessionId} 
          className="w-full h-full" 
        />
      </div>
    </div>
  );
};