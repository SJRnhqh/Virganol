import { memo, useState } from "react";
import { type as getOsType } from "@tauri-apps/plugin-os";
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

// 定义子组件的 Props 接口
interface NavItemProps {
  icon: LucideIcon;
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

        // 👇 1. 容器样式替换
        // Old: bg-[#84A59D] -> New: bg-sidebar-bg (读取语义背景)
        // Old: border-[#E6E1D3]/20 -> New: border-sidebar-border (我们在 light.css 里已经定义了透明度)
        // Old: text-white -> New: text-sidebar-fg (读取语义前景色)
        "bg-sidebar-bg border-r border-sidebar-border text-sidebar-fg",

        "select-none transition-colors duration-300", // 加上过渡，切换主题时更自然
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
            {/* 👇 2. Logo 文字颜色替换 */}
            {/* Old: text-white/90 -> New: text-sidebar-fg/90 */}
            <span className="font-serif italic font-bold text-sidebar-fg/90 text-sm pt-0.5">
              V
            </span>
          </div>

          {/* 在线状态点 */}
          {/* 👇 3. 状态点边框替换 (关键！) */}
          {/* Old: border-[#84A59D] -> New: border-sidebar-bg */}
          {/* 必须和侧边栏背景一致，才能形成“镂空”视觉效果 */}
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-300 rounded-full border-2 border-sidebar-bg animate-pulse"></div>
        </div>
      </div>
    </aside>
  );
});

// 👇 4. 子组件 NavItem 样式替换
const NavItem = ({ icon: Icon, isActive, onClick, label }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "group relative flex items-center justify-center",
      "w-10 h-10 rounded-xl transition-all duration-300 ease-out",
      isActive
        ? // 👇 激活状态
          // Old: bg-[#FAF7F0] -> New: bg-sidebar-active-bg
          // Old: text-[#2F3E46] -> New: text-sidebar-active-fg
          "bg-sidebar-active-bg text-sidebar-active-fg shadow-md scale-100"
        : // 👇 未激活状态 (悬停)
          // Old: text-white/70 -> New: text-sidebar-fg/70
          // Old: hover:text-white -> New: hover:text-sidebar-fg
          "text-sidebar-fg/70 hover:text-sidebar-fg hover:bg-white/15 hover:scale-105",
    )}
    title={label}
  >
    {/* Icon 组件渲染 */}
    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />

    {isActive && (
      // 👇 选中指示条
      // Old: bg-[#FAF7F0] -> New: bg-sidebar-active-bg
      <div className="absolute -left-3.5 w-1 h-4 bg-sidebar-active-bg rounded-r-full" />
    )}
  </button>
);
