import { useMemo, useCallback, useState, useEffect } from "react";
// ✨ 引入 Settings 图标
import { Minus, Maximize2, Minimize2, X, Milestone, Settings } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { type } from "@tauri-apps/plugin-os";
import { NAV_ITEMS } from "@/config/navigation";

interface WindowHeaderProps {
  activeId: string;
}

export function WindowHeader({ activeId }: WindowHeaderProps) {
  const [isWindows] = useState(() => type() === "windows");
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const appWindow = getCurrentWindow();
    appWindow.isMaximized().then(setIsMaximized);
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

  const handleDoubleClick = useCallback(() => {
    getCurrentWindow().toggleMaximize();
  }, []);

  const handleMinimize = () => getCurrentWindow().minimize();
  const handleMaximize = () => getCurrentWindow().toggleMaximize();
  const handleClose = () => getCurrentWindow().close();

  // ⚙️ 设置按钮点击事件 (占位)
  const handleSettings = () => {
    console.log("Open Settings Modal");
    // TODO: Trigger Global Settings Modal
  };

  return (
    <header
      className="relative h-10 flex items-center px-4 sm:px-6 lg:px-20 border-b border-sidebar-border bg-sidebar-bg shrink-0 select-none cursor-default"
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* 🚩 里程碑导航 */}
      <nav className="flex items-center font-medium tracking-wide pointer-events-auto group select-none cursor-default">
        
        {/* 容器 */}
        <div className="relative flex items-center justify-center mr-2">
          
          {/* Milestone 图标
              1. group-hover:text-amber-500: 改为琥珀色，像金色的蜂蜜
              2. drop-shadow-sm: 加一点阴影，让它像金币一样立体
          */}
          <Milestone 
            size={16} 
            strokeWidth={2.5}
            className="transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
                        text-primary/40 
                        group-hover:text-amber-500 
                        group-hover:-translate-y-1 
                        group-hover:rotate-12 
                        group-hover:drop-shadow-md"
          />
          
          {/* ✨ 底部光晕：改为金色的光 (Nectar Glow) */}
          <div className="absolute bottom-1 w-3 h-1 bg-amber-500/0 rounded-full blur-[2px] 
                          transition-all duration-300 
                          group-hover:bg-amber-500/40 group-hover:scale-150" 
          />
        </div>

        {/* 文字：可以选择保持 Primary 色，或者也微微泛金 */}
        <span className="text-sm text-primary/80 font-bold tracking-tight transition-colors duration-300 group-hover:text-primary">
          {currentItem?.label}
        </span>
      </nav>

      {/* ⚙️ 顶部功能区：设置按钮 + (未来可能有的) 用户头像等 */}
      {/* ml-auto: 自动把这块区域推到最右边 */}
      {/* mr-[130px]: 如果是 Windows，需要避开右侧的红绿灯区域 */}
      <div 
        className={`flex items-center h-full ml-auto ${isWindows ? 'mr-16' : 'mr-6'}`}
        // 阻止冒泡，防止点击设置时触发窗口拖拽
        onMouseDown={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleSettings}
          className="group flex items-center justify-center w-8 h-8 rounded-md 
                     text-primary/40 hover:text-primary hover:bg-primary/5 
                     transition-all duration-200"
          title="Settings"
        >
          {/* ⚙️ 经典的齿轮旋转动画：Hover 时旋转 90度 */}
          <Settings 
            size={16} 
            strokeWidth={2.5} 
            className="transition-transform duration-500 ease-in-out group-hover:rotate-90" 
          />
        </button>
      </div>

      {/* 🪟 Windows 控制按钮 (绝对定位在最右侧) */}
      {isWindows && (
        <div
          className="absolute right-0 top-0 h-full flex items-center pr-2"
          onMouseDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
        >
          <button onClick={handleMinimize} className="group h-8 w-10 flex items-center justify-center rounded-md text-primary/30 hover:bg-amber-400/15 hover:text-amber-600 transition-all duration-300 ease-in-out mx-px" title="Minimize">
            <Minus strokeWidth={3} size={14} className="transition-transform duration-300 group-hover:scale-110 group-active:scale-90" />
          </button>
          
          <button onClick={handleMaximize} className="group h-8 w-10 flex items-center justify-center rounded-md text-primary/30 hover:bg-emerald-400/15 hover:text-emerald-600 transition-all duration-300 ease-in-out mx-px" title={isMaximized ? "Restore Down" : "Maximize"}>
            {isMaximized ? (
              <Minimize2 strokeWidth={3} size={13} className="transition-transform duration-300 group-hover:scale-110 group-active:scale-90" />
            ) : (
              <Maximize2 strokeWidth={3} size={13} className="transition-transform duration-300 group-hover:scale-110 group-active:scale-90" />
            )}
          </button>
          
          <button onClick={handleClose} className="group h-8 w-10 flex items-center justify-center rounded-md text-primary/30 hover:bg-rose-500 hover:text-white transition-all duration-300 ease-in-out mx-px" title="Close">
            <X strokeWidth={3} size={14} className="transition-transform duration-300 group-hover:scale-110 group-active:scale-90" />
          </button>
        </div>
      )}
    </header>
  );
}