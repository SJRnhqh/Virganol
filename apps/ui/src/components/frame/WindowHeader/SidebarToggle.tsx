import { PanelLeft, PanelRight } from "lucide-react";
import { useSidebarStore } from "@/store/SidebarStore";
import { cn } from "@/lib/utils";

/**
 * 🎛️ SidebarToggle - 极客重构版
 * 参考 SettingsButton 的配色方案，并引入基于位置的推拉动画
 */
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
        // 1. 基础布局：保持与 SettingsButton 一致的 10x10 尺寸
        "group flex items-center justify-center w-10 h-10 rounded-md transition-all duration-300 ease-in-out",
        
        // 2. 配色方案：完全复用 WindowHeader 的米色调体系
        // - text-header-icon-muted: 60% 透明度米色
        // - hover:text-header-icon: 100% 不透明米色
        // - hover:bg-parchment-fade: 温润米色光晕背景
        "text-header-icon-muted hover:text-header-icon hover:bg-parchment-fade",
        
        // 3. 交互反馈：点击时轻微缩放
        "active:scale-90"
      )}
      title={isOpen ? "收起侧边栏 (Cmd+B)" : "展开侧边栏 (Cmd+B)"}
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
            : "group-hover:-translate-x-0.5"
        )}
      />
    </button>
  );
}