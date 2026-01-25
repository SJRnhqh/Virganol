// apps/ui/src/components/frame/Sidebar/DockItem.tsx
import { useRef } from "react";
import { motion, useSpring, useTransform, MotionValue } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { NavIndicator } from "./NavIndicator";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

interface DockItemProps {
  mouseY: MotionValue;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  side: "left" | "right";
}

export function DockItem({
  mouseY,
  icon: Icon,
  isActive,
  onClick,
  side,
}: DockItemProps) {
  const ref = useRef<HTMLButtonElement>(null);

  // 1. 物理反馈计算 (严格保留你的原始参数)
  const distance = useTransform(mouseY, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return val - bounds.y - bounds.height / 2;
  });

  // 🟢 镜像逻辑 1：位移方向 (严格保留)
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
      {/* 🟢 镜像逻辑 2：侧边激活指示器 (严格保留) */}
      {isActive && <NavIndicator side={side} />}

      {/* 🚀 物理位移容器 + 镜像悬浮标集成 */}
      <motion.div
        style={{ x, scale }}
        className="relative w-11 h-11 flex items-center justify-center"
      >
        <div
          className={cn(
            "flex items-center justify-center w-11 h-11 rounded-2xl transition-colors duration-200",
            isActive
              ? "bg-sidebar-active-bg text-sidebar-active-fg shadow-lg"
              : "bg-transparent text-sidebar-fg/50 group-hover:bg-parchment-fade group-hover:text-sidebar-fg"
          )}
        >
          <Icon strokeWidth={isActive ? 2.5 : 2} size={22} />
        </div>
      </motion.div>
    </button>
  );
}