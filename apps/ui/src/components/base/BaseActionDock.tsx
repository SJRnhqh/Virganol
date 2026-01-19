import { memo, type ReactNode } from "react";

interface BaseActionDockProps {
  children: ReactNode;
}

export const BaseActionDock = memo(({ children }: BaseActionDockProps) => {
  return (
    /* 1. 外层定位：负责屏幕底部的水平居中 */
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
      {/* 2. 内层容器：负责“动感”和“透明感” */}
      <div
        className="
        flex items-center gap-4 px-6 py-4
        bg-charcoal/10 backdrop-blur-2xl
        rounded-[2.5rem] border border-white/10
        shadow-[0_20px_50px_rgba(0,0,0,0.2)]
        transition-all duration-500 ease-out
        hover:py-6 hover:px-8 hover:bg-charcoal/20
        group
      "
      >
        {/* 装饰性的呼吸光效 (让它更有动感) */}
        <div className="absolute inset-0 rounded-[2.5rem] bg-linear-to-b from-white/5 to-transparent pointer-events-none" />

        {children}
      </div>
    </div>
  );
});
