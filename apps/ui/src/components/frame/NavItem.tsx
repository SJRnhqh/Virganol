import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_THEME } from "@/config/navigation";

// 🔴 确保导出接口，防止 Sidebar 等外部文件调用时找不到名称
export interface NavItemProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
  showMargin?: boolean;
}

export const NavItem = ({
  icon: Icon,
  isActive,
  onClick,
  label,
  showMargin = true,
}: NavItemProps) => {
  return (
    <button
      onClick={onClick}
      // 🔴 必须有 group 类名，子元素的 group-hover 才能生效
      className={cn(
        "group relative flex items-center justify-center w-10 h-10 rounded-xl",
        "transition-all duration-300",
        showMargin && "mb-3",
        isActive
          ? "bg-sidebar-active-bg/10 text-sidebar-active-fg"
          : "text-sidebar-fg hover:bg-sidebar-fg/10",
      )}
      title={label}
    >
      <Icon
        size={20}
        strokeWidth={isActive ? 2.4 : 1.8}
        className={cn(
          NAV_THEME.TRANSITION,
          "will-change-transform", // 硬件加速优化缩放

          isActive
            ? `${NAV_THEME.ACTIVE_SCALE} ${NAV_THEME.OPACITY_ACTIVE}`
            : `${NAV_THEME.IDLE_SCALE} ${NAV_THEME.OPACITY_IDLE} ${NAV_THEME.HOVER_SCALE} ${NAV_THEME.HOVER_OPACITY}`,
        )}
      />
    </button>
  );
};
