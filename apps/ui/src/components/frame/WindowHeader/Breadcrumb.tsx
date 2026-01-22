import { Milestone } from "lucide-react";

interface BreadcrumbProps {
  label?: string;
}

/**
 * 🚩 Breadcrumb - 复古蜂蜜金 (Retro Honey) 风格重构
 * 视觉逻辑：常态为墨色印记 (Charcoal)，悬停时转为古铜金 (Honey)
 */
export function Breadcrumb({ label }: BreadcrumbProps) {
  return (
    <nav className="flex items-center font-medium tracking-wide pointer-events-auto group select-none cursor-default">
      <div className="relative flex items-center justify-center mr-2">
        <Milestone
          size={16}
          strokeWidth={2.5}
          className="transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                      text-header-fg/40
                      /* 对应 index.css 中的 --color-breadcrumb-accent */
                      group-hover:text-breadcrumb-accent
                      group-hover:-translate-y-1
                      group-hover:rotate-12
                      /* 阴影使用变量或具体的 HEX 颜色，确保发光感 */
                      group-hover:drop-shadow-[0_0_8px_rgba(180,138,50,0.5)]"
        />

        {/* Glow 也使用同样的变量 */}
        <div
          className="absolute bottom-1 w-3 h-1 bg-breadcrumb-accent/0 rounded-full blur-[2px]
                        transition-all duration-300
                        group-hover:bg-breadcrumb-accent/40 group-hover:scale-150"
        />
      </div>

      {/* 文字颜色保持深炭灰 (header-fg) 以确保可读性 */}
      <span className="text-sm text-header-fg font-bold tracking-tight">
        {label}
      </span>
    </nav>
  );
}
