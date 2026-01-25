// apps/ui/src/components/frame/WindowHeader/SidebarToggle.tsx
import { PanelLeft, PanelRight } from "lucide-react";
import { useSidebarStore } from "@/store/SidebarStore";
import { cn } from "@/lib/utils";

export function SidebarToggle() {
  const { isOpen, side, toggle } = useSidebarStore(); // 使用全局侧边栏状态

  // 🟢 智能图标选择
  const Icon = side === "left" ? PanelLeft : PanelRight;

  return (
    <button
      onClick={toggle}
      onMouseDown={(e) => e.stopPropagation()} // 阻止冒泡，防止触发窗口拖拽
      onDoubleClick={(e) => e.stopPropagation()}
      className={cn(
        // 1. 基础布局
        "group flex items-center justify-center w-10 h-8 rounded-md transition-all duration-300 ease-in-out",

        // 2. 配色方案
        "text-header-icon-muted hover:text-header-icon hover:bg-header-icon-bg",

        // 3. 交互反馈：点击时轻微缩放
        "active:scale-90",
      )}
    >
      <Icon
        size={20} // 视觉上比设置图标略细，更显精致
        strokeWidth={2}
        className={cn(
          // 4. 核心动画逻辑
          "transition-all duration-500 ease-in-out",

          // 状态反馈：收起时显著变淡，暗示“非激活”状态
          isOpen ? "opacity-100" : "opacity-40",

          /**
           * 5. 极客感微动效 (Micro-interaction)：
           * 悬停时图标根据位置产生微小的位移，暗示侧边栏的“推拉”方向。
           * - 位于左侧：向右轻微移动
           * - 位于右侧：向左轻微移动
           */
          side === "left"
            ? "group-hover:translate-x-0.5"
            : "group-hover:-translate-x-0.5",
        )}
      />
    </button>
  );
}
