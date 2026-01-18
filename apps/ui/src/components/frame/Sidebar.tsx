import { memo } from "react";
import { Settings } from "lucide-react";
import { NAV_ITEMS } from "@/config/navigation";
import { NavItem } from "./NavItem";
import { ActiveIndicator } from "./ActiveIndicator";

interface SidebarProps {
  activeId: string;
  onActiveIdChange: (id: string) => void;
}

export const Sidebar = memo(({ activeId, onActiveIdChange }: SidebarProps) => {
  return (
    <aside className="flex flex-col items-center shrink-0 z-40 w-16 h-full bg-sidebar-bg border-r border-sidebar-border text-sidebar-fg transition-all duration-300 pt-3 pb-4">
      <nav className="flex flex-col items-center w-full flex-1 relative">
        {/* 丝滑滑块 - 逻辑已同步至线性位移 */}
        <ActiveIndicator activeId={activeId} />

        {/* 均匀排列的菜单项 */}
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeId === item.id}
            onClick={() => onActiveIdChange(item.id)}
          />
        ))}
      </nav>

      {/* 底部设置按钮 */}
      <div className="mt-auto">
        <NavItem
          icon={Settings}
          label="Settings"
          isActive={false}
          onClick={() => console.log("Open Settings clicked")}
          showMargin={false}
        />
      </div>
    </aside>
  );
});

// 为了更好的调试体验，添加 DisplayName
Sidebar.displayName = "Sidebar";
