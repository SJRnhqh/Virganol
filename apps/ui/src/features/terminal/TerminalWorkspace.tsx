import { useState, useEffect, useRef, useCallback } from "react";
import { useTerminalStore } from "@/store/TerminalStore";
import { XTerm } from "@/components/terminal/XTerm";
import { Maximize2, Minimize2, X, Terminal as TerminalIcon, ChevronRight, Minus, GripHorizontal } from "lucide-react";
import { clsx } from "clsx";

export const TerminalWorkspace = () => {
  const { isOpen, isMaximized, sessions, activeSessionId, switchSession, closeTerminal, toggleMaximize, minimize } = useTerminalStore();

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  // 使用 Ref 保存拖拽起始时的快照，避免闭包陷阱，也不需要作为依赖项
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const windowStartOffsetRef = useRef({ x: 0, y: 0 });

  // 1. 移动逻辑 (稳定函数，依赖为空)
  // 因为使用了 Ref 获取起始位置，所以不需要依赖任何变动的 State
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const deltaX = e.clientX - dragStartPosRef.current.x;
    const deltaY = e.clientY - dragStartPosRef.current.y;

    setOffset({
      x: windowStartOffsetRef.current.x + deltaX,
      y: windowStartOffsetRef.current.y + deltaY,
    });
  }, []);

  // 2. 停止逻辑 (稳定函数，依赖为空)
  // 只需改变状态，不再需要手动 removeEventListener (交给 useEffect)
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 3. 核心修复：使用 Effect 管理事件监听
  // 当 isDragging 变化时，自动挂载/卸载监听器
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    // 清理函数：确保组件卸载或状态改变时移除监听
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // 4. 开始拖拽
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized || e.button !== 0) return;
    e.preventDefault();
    
    // 记录初始快照
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    windowStartOffsetRef.current = { ...offset };

    // 触发 Effect 挂载监听器
    setIsDragging(true);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: isMaximized ? "absolute" : "fixed",
        top: isMaximized ? 0 : "50%",
        left: isMaximized ? 0 : "50%",
        right: isMaximized ? 0 : "auto",
        bottom: isMaximized ? 0 : "auto",
        
        transform: isMaximized 
          ? "none" 
          : `translate3d(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px), 0)`,

        width: isMaximized ? "auto" : "800px",
        height: isMaximized ? "auto" : "500px",
        
        zIndex: isMaximized ? 10 : 9999,
      }}
      className={clsx(
        "flex flex-col overflow-hidden bg-charcoal/95 backdrop-blur-xl shadow-2xl pointer-events-auto",
        // 拖拽时禁用 Transition，保证跟手
        !isDragging && !isMaximized && "transition-all duration-300 ease-out",
        isMaximized ? "rounded-none border-0" : "rounded-xl border border-white/20"
      )}
    >
      {/* Header */}
      <div
        onMouseDown={handleMouseDown}
        className={clsx(
          "flex items-center justify-between h-10 px-4 bg-black/50 border-b border-white/10 select-none shrink-0",
          isMaximized ? "cursor-default" : "cursor-grab active:cursor-grabbing"
        )}
      >
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[70%]" onMouseDown={e => e.stopPropagation()}>
          {sessions.map((s, idx) => (
            <div key={s.nodeId} className="flex items-center group">
                {idx > 0 && <ChevronRight size={14} className="text-white/20 mx-1" />}
                <button 
                  onClick={() => switchSession(s.nodeId)} 
                  className={clsx("flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-mono border transition-all", s.nodeId === activeSessionId ? "bg-forest/20 text-emerald-400 border-emerald-500/30" : "text-sage/60 border-transparent hover:text-white hover:bg-white/5")}
                >
                  <TerminalIcon size={12} /> {s.name}
                  <X size={10} className="ml-1.5 opacity-0 group-hover:opacity-100 hover:text-red-400" onClick={(e) => { e.stopPropagation(); closeTerminal(s.nodeId); }}/>
                </button>
            </div>
          ))}
        </div>
        
        {!isMaximized && <div className="flex-1 flex justify-center opacity-10 pointer-events-none"><GripHorizontal size={16} /></div>}
        {isMaximized && <div className="flex-1" />}

        <div className="flex items-center gap-3 ml-4" onMouseDown={e => e.stopPropagation()}>
          <Minus size={14} onClick={minimize} className="text-sage/50 hover:text-white cursor-pointer"/>
          {isMaximized ? <Minimize2 size={14} onClick={toggleMaximize} className="text-sage/50 hover:text-white cursor-pointer"/> : <Maximize2 size={14} onClick={toggleMaximize} className="text-sage/50 hover:text-white cursor-pointer"/>}
        </div>
      </div>

      <div className="flex-1 bg-black/90 relative p-1 overflow-hidden">
        {activeSessionId && <XTerm key={activeSessionId} nodeId={activeSessionId} className="w-full h-full" />}
      </div>
    </div>
  );
};