import { useState, useRef, useEffect } from "react";
import { Milestone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebarStore } from "@/store/SidebarStore";
import { NAV_ITEMS } from "@/config/navigation";
import { ModuleMenu } from "./ModuleMenu";
import { cn } from "@/lib/utils";

export function Breadcrumb() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const { activeId } = useSidebarStore();
  const currentItem = NAV_ITEMS.find(i => i.id === activeId);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // 500ms 黄金缓冲区
    timeoutRef.current = setTimeout(() => setIsOpen(false), 80);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="flex items-end h-full px-1 group/nav relative" 
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onDoubleClick={(e) => e.stopPropagation()}
        className={cn(
          "flex items-center h-7.5 px-3 z-10001",
          "bg-main-bg border-t border-x border-sidebar-border rounded-t-md",
          "shadow-[0_-2px_10px_var(--color-charcoal-fade)] relative translate-y-px outline-none transition-colors",
          isOpen ? "brightness-95" : "hover:brightness-105"
        )}
      >
        <div className="relative flex items-center justify-center mr-2.5">
          <Milestone size={14} strokeWidth={2.5} className="text-header-icon transition-all group-hover/nav:text-header-breadcrumb-icon-accent group-hover/nav:scale-110" />
        </div>

        <div className="overflow-hidden h-4 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={activeId}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
              className="text-xs text-header-fg font-black tracking-tight uppercase"
            >
              {currentItem?.label || "CELLAR"}
            </motion.span>
          </AnimatePresence>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div 
            className={cn(
              "absolute top-full z-10000 pt-4 px-32 -mx-32", // 🛡️ 全域感应盾牌
            )}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseEnter={() => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
            }}
          >
            <ModuleMenu onClose={() => setIsOpen(false)} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}