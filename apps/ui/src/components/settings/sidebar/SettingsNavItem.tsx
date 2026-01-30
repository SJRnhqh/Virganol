// apps/ui/src/components/settings/sidebar/SettingsNavItem.tsx
import { motion } from "framer-motion";
import { cn } from "@/lib";
import { type LucideIcon } from "lucide-react";

interface SettingsNavItemProps {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
}

export const SettingsNavItem = ({
  label,
  icon: Icon,
  isActive,
  onClick,
}: SettingsNavItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 group",
        isActive
          ? "bg-settings-sidebar-icon-bg text-settings-sidebar-fg-active shadow-lg shadow-black/10"
          : "text-settings-sidebar-fg/60 hover:text-settings-sidebar-fg hover:bg-settings-sidebar-icon-bg/10",
      )}
    >
      {/* 激活状态下的 赭石色指示条 */}
      {isActive && (
        <motion.div
          layoutId="active-indicator"
          className="absolute left-0 w-1 h-4 bg-settings-sidebar-icon-indicator rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}

      <Icon
        className={cn(
          "w-4.5 h-4.5 transition-colors duration-300",
          isActive
            ? "text-settings-sidebar-fg-active"
            : "text-settings-sidebar-fg/50 group-hover:text-settings-sidebar-fg"
        )}
      />
      <span className="relative z-10">{label}</span>
    </button>
  );
};
