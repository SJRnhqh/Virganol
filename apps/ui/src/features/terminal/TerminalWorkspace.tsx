import { useState, useEffect, useRef } from "react";
import { useTerminalStore } from "@/store/TerminalStore";
import { XTerm } from "@/components/terminal/XTerm";
import {
  Maximize2,
  Minimize2,
  X,
  Terminal as TerminalIcon,
  ChevronRight,
  Minus,
  GripHorizontal,
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

  // --- 拖拽状态 ---
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false); // 🌟 新增：用于控制 transition
  
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const windowStartPosRef = useRef({ x: 0, y: 0 });

  // --- 拖拽逻辑 ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation(); // 防止事件穿透

    setIsDragging(true); // 开始拖拽，禁用动画
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    windowStartPosRef.current = { ...position };

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);
  };

  const handleGlobalMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - dragStartPosRef.current.x;
    const deltaY = e.clientY - dragStartPosRef.current.y;

    // requestAnimationFrame 这里可以省去，React 18 批处理足够快
    setPosition({
      x: windowStartPosRef.current.x + deltaX,
      y: windowStartPosRef.current.y + deltaY,
    });
  };

  const handleGlobalMouseUp = () => {
    setIsDragging(false); // 结束拖拽，恢复动画
    document.removeEventListener("mousemove", handleGlobalMouseMove);
    document.removeEventListener("mouseup", handleGlobalMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  });

  if (!isOpen) return null;

  return (
    <div
      // 🌟 动态样式：接管 transform
      style={{
        transform: isMaximized
          ? "none"
          : `translate(calc(-50% + ${position.x}px), ${position.y}px)`,
      }}
      className={clsx(
        "absolute z-40 flex flex-col overflow-hidden",
        "bg-charcoal/95 backdrop-blur-xl border border-white/10 shadow-2xl",
        
        // 🌟 核心修复：拖拽时禁用 transition，否则会卡顿！
        // 只有在 (非拖拽 且 非最大化切换) 时才开启动画
        !isDragging && "transition-all duration-300 ease-out",

        isMaximized
          ? "inset-0 rounded-none border-0"
          // 悬浮样式：移除 Tailwind 的 transform 类，完全由 style 控制
          : "bottom-6 left-1/2 w-200 h-125 rounded-xl border-t border-white/20"
      )}
    >
      {/* --- Header (拖拽触发区) --- */}
      <div
        onMouseDown={handleMouseDown}
        className={clsx(
          "flex items-center justify-between h-10 px-4 bg-black/40 border-b border-white/5 select-none shrink-0",
          // 鼠标手势反馈
          isMaximized ? "cursor-default" : "cursor-grab active:cursor-grabbing"
        )}
      >
        {/* 左侧：面包屑 (阻止冒泡，防止拖拽) */}
        <div 
          className="flex items-center gap-1 overflow-x-auto no-scrollbar"
          onMouseDown={(e) => e.stopPropagation()} 
        >
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

        {/* 中间：把手图标 */}
        {!isMaximized && (
          <div className="flex-1 flex justify-center opacity-10 pointer-events-none">
            <GripHorizontal size={16} />
          </div>
        )}
        {isMaximized && <div className="flex-1" />}

        {/* 右侧：控制按钮 (阻止冒泡) */}
        <div 
            className="flex items-center gap-3 ml-4"
            onMouseDown={(e) => e.stopPropagation()}
        >
          <button onClick={minimize} className="text-sage/50 hover:text-white transition-colors">
            <Minus size={14} />
          </button>
          <button onClick={toggleMaximize} className="text-sage/50 hover:text-white transition-colors">
            {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* --- Terminal --- */}
      <div className="flex-1 bg-black/80 relative overflow-hidden p-1">
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