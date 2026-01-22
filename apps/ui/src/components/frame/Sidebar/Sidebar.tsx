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
  const { isOpen, side } = useSidebarStore();

  return (
    // 1. 外壳 (Mask): 负责物理占位与裁切
    <aside
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "relative h-full z-40 overflow-hidden shrink-0 flex",
        // 宽度过渡：使用更稳健的贝塞尔曲线
        "w-18 data-[state=closed]:w-0",
        "transition-[width] duration-500 ease-in-out",
        
        // 🟢 锚点对齐逻辑：
        // 左侧栏时内容靠右对齐，确保收起时“圆角边框”始终贴合主内容区移动，消除“硬线平移”感
        side === "left" ? "justify-end" : "justify-start"
      )}
      onMouseMove={(e) => mouseY.set(e.pageY)}
      onMouseLeave={() => mouseY.set(Infinity)}
    >
      {/* 2. 内胆 (Inner Container): 负责防挤压、防抖与视差效果 */}
      <div 
        className={cn(
          "w-18 h-full flex flex-col items-center justify-center shrink-0",
          // 视觉过渡：透明度与位移同步
          "transition-all duration-500 ease-in-out",
          isOpen ? "opacity-100 translate-x-0 delay-0" : "opacity-0 delay-1000",
          
          // 🟢 视差位移：收起时内容向反方向微移，模拟“滑入墙体”的物理感
          !isOpen && (side === "left" ? "-translate-x-1/2" : "translate-x-1/2"),

          // 🚀 极客防抖补丁 (Anti-Jitter Patches)
          // 强制开启 GPU 复合层，解决亚像素级渲染导致的图标微颤
          "transform-gpu will-change-transform",
          "backface-hidden perspective-1000px",
          "antialiased"
        )}
        // 进一步锁定 3D 渲染管线
        style={{ transform: 'translateZ(0)' }}
      >
        {/* 3. 视觉本体 (The Dock) */}
        <nav
          className={cn(
            "relative flex flex-col items-center gap-5 py-8 px-3 w-full",
            "bg-sidebar-bg shadow-2xl shadow-charcoal-fade",
            
            // 🟢 智能圆角：始终保持在与页面交界的一侧
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
            />
          ))}
        </nav>
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";