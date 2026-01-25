// apps/ui/src/hooks/useSidebarStyles.ts
import { useSidebarStore } from "@/store/SidebarStore";

export const useSidebarStyles = () => {
  const { isOpen, side, isSwitching } = useSidebarStore();

  // 1. 动态计算透明度
  // 切换中或关闭时隐藏，打开时显示
  const dockOpacityClass = (isSwitching || !isOpen) ? "opacity-0" : "opacity-100";

  // 2. 动态计算动画时长和延迟
  // isSwitching: 快速切换 (200ms)
  // isOpen: 正常打开 (500ms)
  // !isOpen: 正常关闭，但延迟 1s 执行 (为了配合宽度收缩动画)
  const dockTimingClass = isSwitching
    ? "duration-200 delay-0"
    : isOpen
      ? "duration-500 delay-200"
      : "duration-200 delay-0";

  // 3. 动态计算位移
  // 关闭时向左或向右偏移，产生“缩进去”的效果
  const dockTranslateClass = !isOpen
    ? (side === "left" ? "-translate-x-10" : "translate-x-10")
    : "translate-x-0";

  // 4. 动态计算边框和圆角
  // 左侧栏：圆角在右边；右侧栏：圆角在左边
  const dockBorderClass = side === "left"
    ? "border-y border-r border-sidebar-border rounded-r-3xl"
    : "border-y border-l border-sidebar-border rounded-l-3xl";

  return {
    isOpen,
    side,
    // 组合后的样式类
    dockAnimationClass: `${dockOpacityClass} ${dockTimingClass} ${dockTranslateClass}`,
    dockBorderClass,
  };
};