import { memo, useState } from "react";
import { type as getOsType } from "@tauri-apps/plugin-os";
// 👇 1. 引入 LucideIcon 类型
import {
  LayoutGrid,
  Terminal,
  Settings,
  Database,
  Server,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 👇 2. 定义导航项的数据结构类型
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

// 👇 3. 定义子组件的 Props 接口
interface NavItemProps {
  icon: LucideIcon; // 明确指定这是一个图标组件
  isActive: boolean;
  onClick: () => void;
  label: string;
}

export const Sidebar = memo(() => {
  const isMac = getOsType() === "macos";
  const [activeId, setActiveId] = useState("deck");

  return (
    <aside
      data-tauri-drag-region
      className={cn(
        "flex flex-col items-center shrink-0 z-50",
        "w-17 h-full",
        "bg-[#84A59D] border-r border-[#E6E1D3]/20",
        "text-white select-none",
        isMac ? "pt-11" : "pt-4",
      )}
    >
      {/* 导航区域 */}
      <nav className="flex flex-col gap-3 w-full px-3 mt-2 pointer-events-auto">
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
      <div className="mt-auto mb-6 flex flex-col items-center gap-6 pointer-events-auto">
        <NavItem
          icon={Settings}
          isActive={false}
          onClick={() => {}}
          label="Settings"
        />

        {/* Logo */}
        <div className="relative group cursor-default">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-sm transition-transform group-hover:scale-105">
            <span className="font-serif italic font-bold text-white/90 text-sm pt-0.5">
              V
            </span>
          </div>
          {/* 在线状态点 */}
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-300 rounded-full border-2 border-[#84A59D] animate-pulse"></div>
        </div>
      </div>
    </aside>
  );
});

// 👇 4. 使用 NavItemProps 替换 any
const NavItem = ({ icon: Icon, isActive, onClick, label }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "group relative flex items-center justify-center",
      "w-10 h-10 rounded-xl transition-all duration-300 ease-out",
      isActive
        ? "bg-[#FAF7F0] text-[#2F3E46] shadow-md scale-100"
        : "text-white/70 hover:text-white hover:bg-white/15 hover:scale-105",
    )}
    title={label}
  >
    {/* Icon 组件渲染 */}
    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />

    {isActive && (
      <div className="absolute -left-3.5 w-1 h-4 bg-[#FAF7F0] rounded-r-full" />
    )}
  </button>
);
