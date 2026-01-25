import { motion, type Variants } from "framer-motion";
import { NAV_ITEMS } from "@/config/navigation";
import { useSidebarStore } from "@/store/SidebarStore";
import { cn } from "@/lib/utils";

interface ModuleMenuProps {
  onClose: () => void;
}

export function ModuleMenu({ onClose }: ModuleMenuProps) {
  const { activeId, setActiveId } = useSidebarStore();

  // 1. 动效升级：像卷轴一样从左向右展开，而不是简单的淡入
  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, filter: "blur(10px)" },
    visible: {
      opacity: 1, scale: 1, filter: "blur(0px)",
      transition: { type: "spring", stiffness: 300, damping: 25, staggerChildren: 0.04 }
    },
    exit: { opacity: 0, scale: 0.9, filter: "blur(5px)", transition: { duration: 0.15 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.5, x: -10 },
    visible: { opacity: 1, scale: 1, x: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onMouseDown={(e) => e.stopPropagation()}
      className={cn(
        // 2. 容器：极简胶囊 (Pill)，单行排列，去掉厚重阴影，改用精致的内发光
        "flex items-center gap-1 p-1.5",
        "bg-header-breadcrumb-bg backdrop-blur-xl", // 极淡的背景
        "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]",       // 轻飘飘的浮起感
        "rounded-full pointer-events-auto",               // 完全圆角
        "origin-top-left"
      )}
    >
      {/* 3. 直接平铺所有图标，单行显示 */}
      {NAV_ITEMS.map((item) => {
        const isActive = activeId === item.id;
        return (
          <motion.div key={item.id} variants={itemVariants}>
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setActiveId(item.id);
                onClose();
              }}
              className={cn(
                "relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 outline-none",
                isActive
                  ? "text-header-breadcrumb-accent bg-header-breadcrumb-accent/10"
                  : "text-sidebar-fg/80 hover:text-sidebar-fg hover:scale-105"
              )}
            >
              <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />

              {/* 6. 指示器：只保留底部一个小圆点，去掉长条，极度克制 */}
              {isActive && (
                <motion.div
                  layoutId="active-dot-menu"
                  className={cn(
                    "absolute -bottom-1 w-1 h-1 rounded-full",
                    "bg-header-breadcrumb-accent"
                  )}
                />
              )}
            </button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}