import { memo } from "react";
import { useMotionValue } from "framer-motion";
import { NAV_ITEMS } from "@/config/navigation";
import { DockItem } from "./DockItem";

interface SidebarProps {
  activeId: string;
  onActiveIdChange: (id: string) => void;
}

export const Sidebar = memo(({ activeId, onActiveIdChange }: SidebarProps) => {
  const mouseY = useMotionValue(Infinity);

  return (
    <aside
      className="absolute left-0 top-1/2 -translate-y-1/2 z-40"
      onMouseMove={(e) => mouseY.set(e.pageY)}
      onMouseLeave={() => mouseY.set(Infinity)}
    >
      {/* bg-sidebar-bg: 对应 Sage
        border-sidebar-border: 对应 Paper Edge (20% 透明度)
        shadow-charcoal-fade: 使用基于深炭灰的阴影，比纯黑更高级
      */}
      <nav
        className="relative flex flex-col items-center gap-5 py-8 px-3 w-18
                      bg-sidebar-bg border-y border-r border-sidebar-border
                      rounded-r-3xl shadow-2xl shadow-charcoal-fade"
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
    </aside>
  );
});

Sidebar.displayName = "Sidebar";
