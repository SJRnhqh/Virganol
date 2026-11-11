// apps/ui/src/components/header/SideSwitch.tsx
import { ArrowLeftRight } from "lucide-react";

import { cn } from "@/lib";
import { useSidebarStore } from "@/store";

export function SideSwitch() {
  const { toggleSide, side } = useSidebarStore();

  return (
    <button
      className={cn(
        "group flex items-center justify-center w-10 h-8 rounded-md transition-all duration-300 ease-in-out",
        "text-header-icon-muted hover:text-header-icon hover:bg-header-icon-bg",
        "active:scale-90"
      )}
      onClick={toggleSide}
      onDoubleClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <ArrowLeftRight
        className={cn(
          "transition-transform duration-500 ease-in-out",
          // 增加一个旋转动画，体现“翻转”的感觉
          "group-hover:rotate-180",
          // 如果在右边，图标稍微做个水平镜像，视觉更统一
          side === "right" ? "scale-x-[-1]" : ""
        )}
        size={18} // 稍微小一点，作为辅助功能按钮
        strokeWidth={2}
      />
    </button>
  );
}
