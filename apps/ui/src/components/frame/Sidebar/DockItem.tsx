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
  side: "left" | "right";
}

export function DockItem({
  mouseY,
  icon: Icon,
  label,
  isActive,
  onClick,
  side,
}: DockItemProps) {
  const ref = useRef<HTMLButtonElement>(null);

  // 1. 物理反馈计算 (参数完全不动)
  const distance = useTransform(mouseY, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return val - bounds.y - bounds.height / 2;
  });

  // 🟢 镜像逻辑 1：位移方向
  // 保持 16px 的反馈力度，但方向根据 side 翻转，确保始终“向内”悬浮
  const xOffset = side === "left" ? 16 : -16;
  const xSync = useTransform(distance, [-80, 0, 80], [0, xOffset, 0]);
  const scaleSync = useTransform(distance, [-80, 0, 80], [1, 1.15, 1]);

  const springConfig = { stiffness: 800, damping: 35, mass: 0.1 };
  const x = useSpring(xSync, springConfig);
  const scale = useSpring(scaleSync, springConfig);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className="group relative flex items-center justify-center w-full h-11 outline-none cursor-pointer bg-transparent border-none p-0"
    >
      {/* 🟢 镜像逻辑 2：仅传递位置状态，滑块内部的颜色和贴边逻辑由 NavIndicator 自己处理 */}
      {isActive && <NavIndicator side={side} />}

      <motion.div
        style={{ x, scale }}
        className={cn(
          "flex items-center justify-center w-11 h-11 rounded-2xl transition-colors duration-200",
          isActive
            ? "bg-sidebar-active-bg text-sidebar-active-fg shadow-lg"
            : "bg-transparent text-sidebar-fg/50 hover:bg-parchment-fade hover:text-sidebar-fg",
        )}
      >
        <Icon strokeWidth={isActive ? 2.5 : 2} size={22} />
      </motion.div>

      {/* 🟢 镜像逻辑 3：Tooltip 锚点翻转 */}
      <span
        className={cn(
          "absolute px-2.5 py-1.5 text-xs font-bold rounded-lg",
          "bg-sidebar-active-fg text-sidebar-active-bg shadow-xl opacity-0",
          "group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 delay-75",
          "pointer-events-none whitespace-nowrap z-50 border border-sidebar-border",
          
          // 仅修改定位方向：left 换成 right，-translate 换成 translate
          side === "left" 
            ? "left-[calc(100%+20px)] -translate-x-3" 
            : "right-[calc(100%+20px)] translate-x-3"
        )}
      >
        {label}
      </span>
    </button>
  );
}
