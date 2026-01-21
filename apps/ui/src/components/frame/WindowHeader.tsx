import { useMemo, useCallback, useState, useEffect } from "react";
// ✨ 引入 Minimize2 用于 "还原" 状态
import { Minus, Maximize2, Minimize2, X, Milestone } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { type } from "@tauri-apps/plugin-os";
import { NAV_ITEMS } from "@/config/navigation";

interface WindowHeaderProps {
  activeId: string;
}

export function WindowHeader({ activeId }: WindowHeaderProps) {
  const [isWindows] = useState(() => type() === "windows");
  
  // 🔄 新增状态：记录当前窗口是否已最大化
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const appWindow = getCurrentWindow();

    // 1. 初始化时检查状态
    appWindow.isMaximized().then(setIsMaximized);

    // 2. 监听 resize 事件
    // 当用户拖拽边缘、使用 Snap Layout (分屏) 或快捷键时，这个事件会被触发
    // 我们利用它来实时同步 isMaximized 状态
    const updateState = () => {
      appWindow.isMaximized().then(setIsMaximized);
    };

    window.addEventListener("resize", updateState);
    return () => window.removeEventListener("resize", updateState);
  }, []);

  const currentItem = useMemo(() => {
    return NAV_ITEMS.find((item) => item.id === activeId);
  }, [activeId]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (e.button === 0 && e.detail === 1) {
      getCurrentWindow().startDragging();
    }
  }, []);

  // 双击逻辑：Toggle 之后，resize 监听器会自动更新 isMaximized 状态
  const handleDoubleClick = useCallback(() => {
    getCurrentWindow().toggleMaximize();
  }, []);

  const handleMinimize = () => getCurrentWindow().minimize();
  const handleMaximize = () => getCurrentWindow().toggleMaximize();
  const handleClose = () => getCurrentWindow().close();

  return (
    <header
      className="relative h-10 flex items-center px-4 sm:px-6 lg:px-20 border-b border-sidebar-border bg-sidebar-bg shrink-0 select-none cursor-default"
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* 🚩 里程碑式导航 (保持你喜欢的可爱路标) */}
      <nav className="flex items-center font-medium tracking-wide pointer-events-none group">
        <Milestone 
          size={16} 
          strokeWidth={2.5}
          className="mr-2 transition-all duration-300 ease-out 
                     text-primary/40 
                     group-hover:text-primary/80 
                     group-hover:rotate-12"
        />
        <span className="text-sm text-primary/80 font-bold tracking-tight">
          {currentItem?.label}
        </span>
      </nav>

      {/* 🪟 Windows 控制按钮 */}
      {isWindows && (
        <div
          className="absolute right-0 top-0 h-full flex items-center pr-2"
          onMouseDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
        >
          {/* 最小化 */}
          <button 
            onClick={handleMinimize} 
            className="group h-8 w-10 flex items-center justify-center rounded-md text-primary/30 hover:bg-amber-400/15 hover:text-amber-600 transition-all duration-300 ease-in-out mx-px" 
            title="Minimize"
          >
            <Minus strokeWidth={3} size={14} className="transition-transform duration-300 group-hover:scale-110 group-active:scale-90" />
          </button>

          {/* 🟢 智能最大化/还原按钮 */}
          <button 
            onClick={handleMaximize} 
            className="group h-8 w-10 flex items-center justify-center rounded-md text-primary/30 hover:bg-emerald-400/15 hover:text-emerald-600 transition-all duration-300 ease-in-out mx-px" 
            // 根据状态显示不同的 Tooltip
            title={isMaximized ? "Restore Down" : "Maximize"}
          >
            {/* 根据状态切换图标 */}
            {isMaximized ? (
              // 状态：已最大化 -> 显示 "收缩" 图标 (Minimize2)
              <Minimize2 strokeWidth={3} size={13} className="transition-transform duration-300 group-hover:scale-110 group-active:scale-90" />
            ) : (
              // 状态：窗口模式 -> 显示 "扩张" 图标 (Maximize2)
              <Maximize2 strokeWidth={3} size={13} className="transition-transform duration-300 group-hover:scale-110 group-active:scale-90" />
            )}
          </button>

          {/* 关闭 */}
          <button 
            onClick={handleClose} 
            className="group h-8 w-10 flex items-center justify-center rounded-md text-primary/30 hover:bg-rose-500 hover:text-white transition-all duration-300 ease-in-out mx-px" 
            title="Close"
          >
            <X strokeWidth={3} size={14} className="transition-transform duration-300 group-hover:scale-110 group-active:scale-90" />
          </button>
        </div>
      )}
    </header>
  );
}