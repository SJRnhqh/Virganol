import { useMemo } from "react";
import { NAV_ITEMS, NAV_DIMENSIONS } from "@/config/navigation";

interface ActiveIndicatorProps {
  activeId: string;
}

export const ActiveIndicator = ({ activeId }: ActiveIndicatorProps) => {
  const translateY = useMemo(() => {
    const idx = NAV_ITEMS.findIndex((item) => item.id === activeId);
    if (idx === -1) return 0;

    const { ITEM_HEIGHT, ITEM_MARGIN, INDICATOR_OFFSET } = NAV_DIMENSIONS;

    // 🔴 纯线性计算：索引 * (高度 + 间距) + 修正偏移
    return idx * (ITEM_HEIGHT + ITEM_MARGIN) + INDICATOR_OFFSET;
  }, [activeId]);

  return (
    <div
      className="absolute -right-px w-0.75 h-5 bg-sidebar-active-bg rounded-l-full z-10 shadow-[-2px_0_10px_rgba(var(--sidebar-active-bg),0.3)] transition-all"
      style={{
        transform: `translateY(${translateY}px)`,
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        transitionDuration: "400ms",
      }}
    />
  );
};
