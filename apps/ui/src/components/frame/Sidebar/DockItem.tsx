import { useRef } from "react";
import { motion, useSpring, useTransform, MotionValue } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { NavIndicator } from "./NavIndicator";

// 内部使用的简单类名合并
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

interface DockItemProps {
  mouseY: MotionValue;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function DockItem({
  mouseY,
  icon: Icon,
  label,
  isActive,
  onClick,
}: DockItemProps) {
  const ref = useRef<HTMLButtonElement>(null);

  // 1. 物理反馈计算 (完全恢复原始参数)
  const distance = useTransform(mouseY, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return val - bounds.y - bounds.height / 2;
  });

  const xSync = useTransform(distance, [-80, 0, 80], [0, 16, 0]);
  const scaleSync = useTransform(distance, [-80, 0, 80], [1, 1.15, 1]);

  // 极速响应配置 (保持 800/35/0.1)
  const springConfig = { stiffness: 800, damping: 35, mass: 0.1 };

  const x = useSpring(xSync, springConfig);
  const scale = useSpring(scaleSync, springConfig);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className="group relative flex items-center justify-center w-full h-11 outline-none cursor-pointer bg-transparent border-none p-0"
    >
      {isActive && <NavIndicator />}

      <motion.div
        style={{ x, scale }}
        className={cn(
          "flex items-center justify-center w-11 h-11 rounded-2xl transition-colors duration-200", // 恢复原始 CSS transition
          isActive
            ? "bg-sidebar-active-bg text-sidebar-active-fg shadow-lg"
            : "bg-transparent text-sidebar-fg/50 hover:bg-parchment-fade hover:text-sidebar-fg", // 仅修改语义色
        )}
      >
        <Icon strokeWidth={isActive ? 2.5 : 2} size={22} />
      </motion.div>

      {/* Tooltip - 仅修改背景、文字和边框的语义色 */}
      <span
        className={cn(
          "absolute left-[calc(100%+20px)] px-2.5 py-1.5 text-xs font-bold rounded-lg",
          "bg-sidebar-active-fg text-sidebar-active-bg shadow-xl opacity-0 -translate-x-3", // 语义化背景/文字
          "group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 delay-75", // 恢复原始 150ms 响应
          "pointer-events-none whitespace-nowrap z-50 border border-sidebar-border", // 语义化边框
        )}
      >
        {label}
      </span>
    </button>
  );
}
