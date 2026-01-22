import { memo } from "react";
import { useMotionValue } from "framer-motion";
import { NAV_ITEMS } from "@/config/navigation";
import { DockItem } from "./DockItem";
import { useSidebarStore } from "@/store/SidebarStore";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeId: string;
  onActiveIdChange: (id: string) => void;
}

export const Sidebar = memo(({ activeId, onActiveIdChange }: SidebarProps) => {
  const mouseY = useMotionValue(Infinity);
  
  // 🟢 引入 isSwitching 状态
  const { isOpen, side, isSwitching } = useSidebarStore();

  return (
    <aside
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "relative h-full z-40 overflow-hidden shrink-0 flex",
        "w-18 data-[state=closed]:w-0",
        "transition-[width] duration-500 ease-in-out",
        
        // 镜像锚点逻辑：无论侧边栏在哪边，收起时圆角边缘始终贴合主屏幕
        side === "left" ? "justify-end" : "justify-start"
      )}
      onMouseMove={(e) => mouseY.set(e.pageY)}
      onMouseLeave={() => mouseY.set(Infinity)}
    >
      {/* 2. 内胆 (Inner Container) */}
      <div 
        className={cn(
          "w-18 h-full flex flex-col items-center justify-center shrink-0",
          // 🟢 调整过渡动画：
          // 我们将时长稍微缩短到 300ms 以保证“呼吸感”的清脆，位置切换时使用 duration-200
          "transition-all ease-in-out",
          
          // 🟢 核心逻辑：
          // 1. 如果正在切换位置 (isSwitching) 或 已收起 (!isOpen) -> 透明度为 0
          // 2. 正常展开状态 -> 透明度为 100
          (isSwitching || !isOpen) ? "opacity-0" : "opacity-100",
          
          // 🟢 这里的持续时间与延迟控制：
          // - 如果是正在切换位置，过程要快 (200ms)
          // - 如果是正常的打开/关闭，沿用你喜欢的 500ms + 非对称延迟
          isSwitching 
            ? "duration-200 delay-0" 
            : (isOpen ? "duration-500 delay-0" : "duration-500 delay-1000"),

          // 视差位移逻辑
          !isOpen && (side === "left" ? "-translate-x-1/2" : "translate-x-1/2"),

          // 硬件加速补丁
          "transform-gpu will-change-transform",
          "backface-hidden perspective-[1000px]",
          "antialiased"
        )}
        style={{ transform: 'translateZ(0)' }}
      >
        <nav
          className={cn(
            "relative flex flex-col items-center gap-5 py-8 px-3 w-full",
            "bg-sidebar-bg shadow-2xl shadow-charcoal-fade",
            
            // 🟢 圆角与边框随 side 瞬间翻转
            side === "left" 
              ? "border-y border-r border-sidebar-border rounded-r-3xl" 
              : "border-y border-l border-sidebar-border rounded-l-3xl"
          )}
        >
          {NAV_ITEMS.map((item) => (
            <DockItem
              key={item.id}
              mouseY={mouseY}
              isActive={activeId === item.id}
              onClick={() => onActiveIdChange(item.id)}
              icon={item.icon}
              label={item.label}
              side={side}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";