import { motion, type Variants } from "framer-motion";
import { NAV_ITEMS } from "@/config/navigation";
import { useSidebarStore } from "@/store/SidebarStore";
import { GlassTooltip } from "../GlassTooltip";
import { cn } from "@/lib/utils";

interface ModuleMenuProps {
  onClose: () => void;
}

export function ModuleMenu({ onClose }: ModuleMenuProps) {
  const { activeId, setActiveId, side } = useSidebarStore();

  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.92, y: -8 },
    visible: {
      opacity: 1, scale: 1, y: 0,
      transition: { type: "spring", stiffness: 400, damping: 30, staggerChildren: 0.06 }
    },
    exit: { opacity: 0, scale: 0.95, y: -5, transition: { duration: 0.15 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 8, scale: 0.8 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onMouseDown={(e) => e.stopPropagation()}
      className={cn(
        "flex flex-col gap-2.5 p-3.5 min-w-44",
        "bg-sidebar-bg/90 backdrop-blur-3xl border border-sidebar-border shadow-[0_30px_70px_-10px_rgba(0,0,0,0.5)]",
        "rounded-[2.2rem] pointer-events-auto",
        /* 🚀 这里的 origin 确保菜单从正确的方向展开 */
        side === "left" ? "origin-top-left" : "origin-top-right"
      )}
    >
      {[NAV_ITEMS.slice(0, 4), NAV_ITEMS.slice(4)].map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className={cn(
            "flex items-center gap-2.5", 
            /* 🚀 根据 side 镜像第二行的偏移方向，保持视觉平衡 */
            rowIndex === 1 && (side === "left" ? "pl-6" : "pr-6")
          )}
        >
          {row.map((item) => {
            const isActive = activeId === item.id;
            return (
              <motion.div key={item.id} variants={itemVariants}>
                {/* 🚀 关键：将 side 传下去，Tooltip 才知道往哪边弹 */}
                <GlassTooltip label={item.label} side={side}>
                  <button
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setActiveId(item.id);
                      onClose();
                    }}
                    className={cn(
                      "relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 outline-none",
                      isActive 
                        ? "bg-sidebar-active-bg text-sidebar-active-fg shadow-lg scale-110" 
                        : "text-sidebar-fg/40 hover:text-sidebar-fg hover:bg-sidebar-fg/10 hover:scale-105"
                    )}
                  >
                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    
                    {/* 🚀 蜂蜜色指示条 */}
                    {isActive && (
                      <motion.div 
                        layoutId="active-line-menu"
                        className="absolute -bottom-1.5 w-4 h-0.5 bg-breadcrumb-accent rounded-full shadow-[0_0_10px_var(--color-honey)]"
                      />
                    )}
                  </button>
                </GlassTooltip>
              </motion.div>
            );
          })}
        </div>
      ))}
    </motion.div>
  );
}