// apps/ui/src/components/workbench/Sidebar/Sidebar.tsx
import { useMotionValue } from "framer-motion";
import { memo } from "react";

import type { SidebarProps } from "@/types";
import { NAV_ITEMS } from "@/constants";
import { cn } from "@/lib";
import { useSidebarStyles } from "@/hooks";
import { DockItem } from "./DockItem";

export const Sidebar = memo(({ activeNavId, setActiveNavId }: SidebarProps) => {
  const mouseY = useMotionValue(Infinity);

  // ✨ 使用 Hook 获取样式逻辑，不再直接调用 useSidebarStore
  // 这里解构出的变量全是语义化的，没有复杂的 ternary operator (? :)
  const { isOpen, side, dockAnimationClass, dockBorderClass } = useSidebarStyles();

  return (
    <aside
      className={cn(
        "relative h-full z-40 shrink-0 flex transition-[width] duration-500 ease-in-out",
        "w-18 data-[state=closed]:w-0",
        // 🚀 核心：展开时允许溢出显示 Tooltip，收起时隐藏
        isOpen ? "overflow-visible" : "overflow-hidden",
        side === "left" ? "justify-end" : "justify-start"
      )}
      data-state={isOpen ? "open" : "closed"}
      onMouseLeave={() => mouseY.set(Infinity)}
      onMouseMove={(e) => mouseY.set(e.pageY)}
    >
      <div
        className={cn(
          "w-18 h-full flex flex-col items-center justify-center shrink-0",
          "transition-all ease-in-out transform-gpu will-change-transform",
          // ✨ 这里直接使用 Hook 计算好的动画类，非常干净
          dockAnimationClass
        )}
      >
        <nav
          className={cn(
            "relative flex flex-col items-center gap-5 py-8 px-3 w-full",
            "bg-sidebar-bg shadow-2xl shadow-charcoal-fade",
            // ✨ 这里直接使用 Hook 计算好的边框类
            dockBorderClass
          )}
        >
          {NAV_ITEMS.map((item) => (
            <DockItem
              icon={item.icon}
              isActive={activeNavId === item.id}
              key={item.id}
              mouseY={mouseY}
              onClick={() => setActiveNavId(item.id)}
              side={side}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";
