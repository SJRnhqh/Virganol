import { ArrowLeftRight } from "lucide-react";
import { useSidebarStore } from "@/store/SidebarStore";
import { cn } from "@/lib/utils";

/**
 * ↔️ SideSwitch - 侧边栏左右镜像切换器
 * 极客精神：一键翻转整个应用的交互布局
 */
export function SideSwitch() {
  const { toggleSide, side } = useSidebarStore();

  return (
    <button
      onClick={toggleSide}
      onMouseDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      className={cn(
        "group flex items-center justify-center w-10 h-10 rounded-md transition-all duration-300 ease-in-out",
        "text-header-icon-muted hover:text-header-icon hover:bg-parchment-fade",
        "active:scale-90"
      )}
      title={`切换侧边栏到${side === "left" ? "右侧" : "左侧"}`}
    >
      <ArrowLeftRight
        size={18} // 稍微小一点，作为辅助功能按钮
        strokeWidth={2}
        className={cn(
          "transition-transform duration-500 ease-in-out",
          // 增加一个旋转动画，体现“翻转”的感觉
          "group-hover:rotate-180",
          // 如果在右边，图标稍微做个水平镜像，视觉更统一
          side === "right" ? "scale-x-[-1]" : ""
        )}
      />
    </button>
  );
}