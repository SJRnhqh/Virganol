// apps/ui/src/components/frame/Sidebar/Sidebar.tsx
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
  const { isOpen, side, isSwitching } = useSidebarStore();

  return (
    <aside
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "relative h-full z-40 shrink-0 flex transition-[width] duration-500 ease-in-out",
        "w-18 data-[state=closed]:w-0",
        // 🚀 核心：展开时允许溢出显示 Tooltip，收起时隐藏
        isOpen ? "overflow-visible" : "overflow-hidden",
        side === "left" ? "justify-end" : "justify-start"
      )}
      onMouseMove={(e) => mouseY.set(e.pageY)}
      onMouseLeave={() => mouseY.set(Infinity)}
    >
      <div 
        className={cn(
          "w-18 h-full flex flex-col items-center justify-center shrink-0",
          "transition-all ease-in-out transform-gpu will-change-transform",
          (isSwitching || !isOpen) ? "opacity-0" : "opacity-100",
          isSwitching 
            ? "duration-200 delay-0" 
            : (isOpen ? "duration-500 delay-0" : "duration-500 delay-1000"),
          !isOpen && (side === "left" ? "-translate-x-1/2" : "translate-x-1/2")
        )}
      >
        <nav
          className={cn(
            "relative flex flex-col items-center gap-5 py-8 px-3 w-full",
            "bg-sidebar-bg shadow-2xl shadow-charcoal-fade",
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
              side={side}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";