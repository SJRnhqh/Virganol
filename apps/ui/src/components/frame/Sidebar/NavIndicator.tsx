// apps/ui/src/components/frame/Sidebar/NavIndicator.tsx
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavIndicatorProps {
  side: "left" | "right";
}

export function NavIndicator({ side }: NavIndicatorProps) {
  return (
    <motion.div
      layoutId="active-pill"
      /**
       * 🎨 样式完全保留，仅对位置和圆角进行镜像
       */
      className={cn(
        "absolute w-1 h-7 z-50 bg-sidebar-active-bg shadow-[0_0_10px_var(--color-sidebar-active-bg)]",
        // 🟢 镜像逻辑
        // 左边时：贴右 (-right-3)，圆角向左 (rounded-l-full)
        // 右边时：贴左 (-left-3)，圆角向右 (rounded-r-full)
        side === "left" 
          ? "-right-3 rounded-l-full" 
          : "-left-3 rounded-r-full"
      )}
      // 🚀 物理反馈参数严格保持原样，没有任何变动
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 40,
        mass: 0.2,
      }}
    />
  );
}