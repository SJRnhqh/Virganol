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
        // ✅ 侧边栏的竖线。因为它在 Header 之下，所以它不会穿透顶栏
        "bg-sidebar-bg border-r border-sidebar-border text-sidebar-fg",
        "transition-colors duration-300 pt-4",
      )}
    >
      {/* 导航区域 */}
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

      {/* 底部区域 */}
      <div className="mt-auto mb-6 flex flex-col items-center gap-6">
        <NavItem
          icon={Settings}
          isActive={false}
          onClick={() => {}}
          label="Settings"
        />

        {/* Logo */}
        <div className="relative group cursor-default">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-sm transition-transform group-hover:scale-105">
            <span className="font-serif italic font-bold text-sidebar-fg/90 text-sm pt-0.5">
              V
            </span>
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-300 rounded-full border-2 border-sidebar-bg animate-pulse"></div>
        </div>
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
      <div className="absolute -left-3.5 w-1 h-5 bg-sidebar-active-bg rounded-r-full" />
    )}
  </button>
);
