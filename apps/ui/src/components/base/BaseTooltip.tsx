import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface BaseTooltipProps {
  children: React.ReactNode;
  /** 显示的内容，支持简单的字符串或复杂的 ReactNode */
  content: React.ReactNode;
  /** 弹出的方向，默认 right */
  side?: "left" | "right";
  /** 额外的样式类名，用于特定场景覆盖 */
  className?: string;
  /** 延迟显示的毫秒数，避免鼠标划过时频繁闪烁 */
  delay?: number;
}

export function BaseTooltip({ 
  children, 
  content, 
  side = "right", 
  className,
  delay = 300 
}: BaseTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  // 使用 ref 或 timer 来管理延迟，这里用简单的 timeout 逻辑演示核心思路
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  // 基础偏移量逻辑：不再写死 10px，留一点余地
  const xOffset = side === "left" ? 8 : -8;

  return (
    <div 
      className="relative flex items-center justify-center" // 移除 w-full h-full，避免破坏子元素布局
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: -xOffset, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -xOffset, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }} // 更快、更干脆的动画
            className={cn(
              // 📦 核心布局：绝对定位、层级、不阻挡鼠标
              "absolute z-50 pointer-events-none whitespace-nowrap",
              // 🎨 基础外观：这里不再写死颜色，而是引用 CSS 变量或基础类
              "px-3 py-1.5 rounded text-xs font-medium",
              "bg-popover text-popover-foreground shadow-md border border-border", // 使用 shadcn/ui 或标准语义类名
              
              // 📍 基础定位
              side === "left" ? "right-full mr-2" : "left-full ml-2",
              
              // 允许外部传入 className 覆盖
              className
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </div>
  );
}