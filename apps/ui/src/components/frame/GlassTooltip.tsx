import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassTooltipProps {
  children: React.ReactNode;
  label: string;
  side: "left" | "right"; 
}

export function GlassTooltip({ children, label, side }: GlassTooltipProps) {
  const [isHovered, setIsHovered] = useState(false);

  // 🟢 镜像偏移：左侧时向右弹出 (10px)，右侧时向左弹出 (-10px)
  const xOffset = side === "left" ? 10 : -10;

  return (
    <div 
      className="relative inline-flex items-center justify-center w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -xOffset, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -xOffset / 2, y: -5, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            className={cn(
              "absolute top-3/4 z-100 px-2.5 py-1 rounded-lg pointer-events-none select-none",
              /* 🚀 Honey 玻璃色：高透、琥珀边框、深度模糊 */
              "bg-amber-500/10 backdrop-blur-xl border border-amber-400/30 shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
              side === "left" ? "left-3/4" : "right-3/4"
            )}
          >
            {/* 🚀 文字：琥珀色发光，首字母大写 */}
            <span className="text-[10px] font-bold text-amber-400 tracking-wider capitalize whitespace-nowrap drop-shadow-[0_0_5px_rgba(251,191,36,0.6)]">
              {label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}