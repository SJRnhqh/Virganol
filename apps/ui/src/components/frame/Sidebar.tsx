import { memo } from "react";
import { Settings } from "lucide-react";
import { NAV_ITEMS } from "@/config/navigation";
import { NavItem } from "./NavItem";
import { ActiveIndicator } from "./ActiveIndicator";
// 🔴 导入 Store 以驱动设置弹窗
import { useServerStore } from "@/store/useServerStore";

interface SidebarProps {
  activeId: string;
  onActiveIdChange: (id: string) => void;
}

export const Sidebar = memo(({ activeId, onActiveIdChange }: SidebarProps) => {
  // 🔴 获取控制设置面板的方法
  const toggleSettings = useServerStore((state) => state.toggleSettings);

  return (
    <aside className="flex flex-col items-center shrink-0 z-40 w-16 h-full bg-sidebar-bg border-r border-sidebar-border text-sidebar-fg transition-all duration-300 pt-3 pb-4">
      <nav className="flex flex-col items-center w-full flex-1 relative">
        {/* 滑块指示器 */}
        <ActiveIndicator activeId={activeId} />

        {/* 渲染导航项 (Nodes, Bot, Vault 等) */}
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

      {/* 底部设置按钮区域 */}
      <div className="mt-auto w-full flex flex-col items-center">
        <NavItem
          icon={Settings}
          label="Settings"
          isActive={false}
          // 🔴 核心修复：点击时调用全局状态打开弹窗
          onClick={() => toggleSettings(true)}
          showMargin={false}
        />
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";