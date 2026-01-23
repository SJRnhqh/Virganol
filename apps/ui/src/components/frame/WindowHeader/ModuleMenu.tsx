// apps/ui/src/components/frame/WindowHeader/ModuleMenu.tsx
import { motion, type Variants } from "framer-motion";
import { NAV_ITEMS } from "@/config/navigation";
import { useSidebarStore } from "@/store/SidebarStore";
import { cn } from "@/lib/utils";

interface ModuleMenuProps {
  onClose: () => void;
}

export function ModuleMenu({ onClose }: ModuleMenuProps) {
  const { activeId, setActiveId } = useSidebarStore();

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
        "rounded-[2.2rem] pointer-events-auto"
      )}
    >
      {[NAV_ITEMS.slice(0, 4), NAV_ITEMS.slice(4)].map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className={cn(
            "flex items-center gap-2.5"
          )}
        >
          {row.map((item) => {
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
                      "relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 outline-none",
                      isActive 
                        ? "bg-sidebar-active-bg text-sidebar-active-fg shadow-lg scale-110"
                        : "text-sidebar-fg/40 hover:text-sidebar-fg hover:bg-sidebar-fg/10 hover:scale-105"
                    )}
                  >
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  
                    {isActive && (
                      <motion.div 
                        layoutId="active-line-menu"
                        className={cn(
                              "absolute -bottom-1.5 w-4 h-0.5 rounded-full",
                              
                              /* 1. 背景色：直接使用你在 index.css @theme 里定义的语义类名 */
                              "bg-header-breadcrumb-accent",
                              
                              /* 2. 发光阴影：使用任意值语法调用你的影子变量 */
                              /* 逻辑：0偏移，8px模糊，颜色来自 var(--color-header-breadcrumb-shadow) */
                              "shadow-[0_0_8px_var(--color-header-breadcrumb-shadow)]"
                            )}
                      />
                    )}
                  </button>
              </motion.div>
            );
          })}
        </div>
      ))}
    </motion.div>
  );
}