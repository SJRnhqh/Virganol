import { useMemo, useCallback, useState } from "react";
import { ChevronRight, Minus, Maximize2, X } from "lucide-react"; // ✨ 换了更灵动的图标
import { getCurrentWindow } from "@tauri-apps/api/window";
import { type } from "@tauri-apps/plugin-os";
import { NAV_ITEMS } from "@/config/navigation";

interface WindowHeaderProps {
  activeId: string;
}

export function WindowHeader({ activeId }: WindowHeaderProps) {
  // ⚡️ Lazy State 初始化 OS 检测
  const [isWindows] = useState(() => type() === "windows");

  const currentItem = useMemo(() => {
    return NAV_ITEMS.find((item) => item.id === activeId);
  }, [activeId]);

  const groupLabel = useMemo(() => {
    const groupMap: Record<string, string> = {
      logic: "Cognition",
      infra: "Infrastructure",
      assets: "Assets",
    };
    return currentItem ? groupMap[currentItem.group] : "Core";
  }, [currentItem]);

  // 🖱️ 拖拽逻辑
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (e.button === 0 && e.detail === 1) {
      getCurrentWindow().startDragging();
    }
  }, []);

  // 🔄 双击最大化
  const handleDoubleClick = useCallback(() => {
    getCurrentWindow().toggleMaximize();
  }, []);

  const handleMinimize = () => getCurrentWindow().minimize();
  const handleMaximize = () => getCurrentWindow().toggleMaximize();
  const handleClose = () => getCurrentWindow().close();

  return (
    <header
      className="relative h-10 flex items-center px-20 border-b border-sidebar-border bg-sidebar-bg shrink-0 select-none cursor-default"
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* 面包屑导航 (保持原样) */}
      <nav className="flex items-center text-[10px] font-medium tracking-widest pointer-events-none">
        <span className="text-primary/20 uppercase">Virganol</span>
        <ChevronRight size={10} className="mx-3 text-primary/10" />
        <span className="text-primary/40 uppercase font-light">
          {groupLabel}
        </span>
        <ChevronRight size={10} className="mx-3 text-primary/10" />
        <span className="text-primary/90 font-bold tracking-normal">
          {currentItem?.label}
        </span>
      </nav>

      {/* 🪟 Windows 专属可爱风控制按钮组 */}
      {isWindows && (
        <div
          className="absolute right-0 top-0 h-full flex items-center"
          // 阻止冒泡，避免误触拖拽
          onMouseDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
        >
          {/* 🟡 最小化 - Amber (琥珀色) */}
          <button
            onClick={handleMinimize}
            className="group h-full w-12 flex items-center justify-center text-primary/40 
                       hover:bg-amber-400/10 hover:text-amber-500 
                       transition-all duration-300 ease-in-out"
            title="Minimize"
          >
            {/* 图标独立动画：Hover时放大回弹 */}
            <Minus 
              strokeWidth={2.5} 
              size={18} 
              className="transition-transform duration-300 group-hover:scale-110 group-active:scale-90" 
            />
          </button>

          {/* 🟢 最大化 - Emerald (祖母绿) */}
          <button
            onClick={handleMaximize}
            className="group h-full w-12 flex items-center justify-center text-primary/40 
                       hover:bg-emerald-400/10 hover:text-emerald-500 
                       transition-all duration-300 ease-in-out"
            title="Maximize"
          >
            {/* 使用 Maximize2 (扩张箭头) 替代呆板的方块 */}
            <Maximize2 
              strokeWidth={2.5} 
              size={16} 
              className="transition-transform duration-300 group-hover:scale-110 group-active:scale-90" 
            />
          </button>

          {/* 🔴 关闭 - Rose (玫瑰红) */}
          <button
            onClick={handleClose}
            className="group h-full w-12 flex items-center justify-center text-primary/40 
                       hover:bg-rose-500 hover:text-white 
                       transition-all duration-300 ease-in-out"
            title="Close"
          >
            <X 
              strokeWidth={2.5} 
              size={18} 
              className="transition-transform duration-300 group-hover:scale-110 group-active:scale-90" 
            />
          </button>
        </div>
      )}
    </header>
  );
}