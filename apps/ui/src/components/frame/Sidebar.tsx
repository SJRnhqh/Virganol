import { memo, useState } from "react";
import {
  LayoutGrid,
  Terminal,
  Settings,
  Database,
  Server,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 定义导航项的数据结构类型
interface NavItemConfig {
  id: string;
  icon: LucideIcon;
  label: string;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: "deck", icon: LayoutGrid, label: "Node Deck" },
  { id: "term", icon: Terminal, label: "Terminal" },
  { id: "servers", icon: Server, label: "Servers" },
  { id: "data", icon: Database, label: "Data" },
];

export const Sidebar = memo(() => {
  const [activeId, setActiveId] = useState("deck");

  return (
    <aside
      className={cn(
        "flex flex-col items-center shrink-0 z-40",
        "w-17 h-full",
        // 侧边栏的竖线，位于 Header 之下
        "bg-sidebar-bg border-r border-sidebar-border text-sidebar-fg",
        "transition-colors duration-300 pt-4",
      )}
    >
      {/* 1. 顶部导航区域 */}
      <nav className="flex flex-col gap-4 w-full px-3">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            isActive={activeId === item.id}
            onClick={() => setActiveId(item.id)}
            label={item.label}
          />
        ))}
      </nav>

      {/* 2. 底部功能区域 (已移除用户头像和状态点) */}
      <div className="mt-auto mb-6 flex flex-col items-center">
        <NavItem
          icon={Settings}
          isActive={false}
          onClick={() => {
            // 这里以后可以放置打开设置面板的逻辑
            console.log("Open Settings");
          }}
          label="Settings"
        />
      </div>
    </aside>
  );
});

const NavItem = ({
  icon: Icon,
  isActive,
  onClick,
  label,
}: {
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "group relative flex items-center justify-center",
      "w-11 h-11 rounded-xl transition-all duration-300 ease-out",
      isActive
        ? "bg-sidebar-active-bg text-sidebar-active-fg shadow-sm scale-100"
        : "text-sidebar-fg/60 hover:text-sidebar-fg hover:bg-white/10 hover:scale-105",
    )}
    title={label}
  >
    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />

    {isActive && (
      // 激活状态的侧边指示条
      <div className="absolute -left-3.5 w-1 h-5 bg-sidebar-active-bg rounded-r-full" />
    )}
  </button>
);
