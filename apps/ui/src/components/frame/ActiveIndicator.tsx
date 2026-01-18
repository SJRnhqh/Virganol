import { useMemo } from "react";
import { NAV_ITEMS, NAV_DIMENSIONS } from "@/config/navigation";

interface ActiveIndicatorProps {
  activeId: string;
}

export const ActiveIndicator = ({ activeId }: ActiveIndicatorProps) => {
  const translateY = useMemo(() => {
    const idx = NAV_ITEMS.findIndex((item) => item.id === activeId);
    if (idx === -1) return 0;

    const { ITEM_HEIGHT, ITEM_MARGIN, SEPARATOR_HEIGHT, INDICATOR_OFFSET } =
      NAV_DIMENSIONS;

    let offset = idx * (ITEM_HEIGHT + ITEM_MARGIN);

    // 分组偏移逻辑保持不变
    const currentItem = NAV_ITEMS[idx];
    if (currentItem.group === "infra") offset += SEPARATOR_HEIGHT;
    if (currentItem.group === "assets") offset += SEPARATOR_HEIGHT * 2;

    return offset + INDICATOR_OFFSET;
  }, [activeId]);

  return (
    <div
      // 🔴 关键修正：从左侧移至右侧，正好贴在侧边栏的 border-r 上
      className="absolute -right-px w-0.75 h-5 bg-sidebar-active-bg rounded-l-full z-10 shadow-[-2px_0_10px_rgba(var(--sidebar-active-bg),0.3)] transition-all"
      style={{
        transform: `translateY(${translateY}px)`,
        // 丝滑的贝塞尔曲线保持不变
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        transitionDuration: "400ms",
      }}
    />
  );
};
