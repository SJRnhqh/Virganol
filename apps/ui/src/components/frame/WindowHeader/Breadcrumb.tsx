import { Milestone } from "lucide-react";

interface BreadcrumbProps {
  label?: string;
}

export function Breadcrumb({ label }: BreadcrumbProps) {
  return (
    <div className="flex items-end h-full px-1 group/nav">
      <div
        className="flex items-center h-7.5 px-3
                   bg-main-bg border-t border-x border-sidebar-border rounded-t-md
                   shadow-[0_-2px_10px_var(--color-charcoal-fade)]
                   relative translate-y-px z-10"
      >
        {/* 1. 图标容器 */}
        <div className="relative flex items-center justify-center mr-2.5">
          <Milestone
            size={14}
            strokeWidth={2.5}
            /**
             * 🎨 动画重构：触感弹跳 (Tactile Pop)
             * - ❌ 移除了 rotate-12
             * - ✅ duration-300: 时间缩短，更干脆
             * - ✅ ease-[cubic...]: 自定义回弹曲线，带来物理弹射感
             * - ✅ scale-110: 悬停时稍微放大，强调焦点
             * - ✅ -translate-y-0.5: 稍微上浮
             */
            className="text-header-fg/60
                       transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                       group-hover/nav:text-breadcrumb-accent
                       group-hover/nav:scale-110
                       group-hover/nav:-translate-y-0.5"
          />

          {/* 2. 底部光晕：配合图标的弹跳节奏 */}
          {/* 加快了扩散速度，并稍微增加了扩散范围 */}
          <div
            className="absolute inset-0 bg-breadcrumb-accent/0 blur-xs rounded-full
                          transition-all duration-300 ease-out
                          group-hover/nav:bg-breadcrumb-accent/30 group-hover/nav:scale-125"
          />
        </div>

        <span className="text-xs text-header-fg font-black tracking-tight whitespace-nowrap uppercase">
          {label || "Workspace"}
        </span>

        <div
          className="ml-3 w-1.5 h-1.5 rounded-full bg-breadcrumb-accent
                     shadow-[0_0_4px_var(--color-honey)] opacity-80"
        />
      </div>
    </div>
  );
}
