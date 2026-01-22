import { Milestone } from "lucide-react";

interface BreadcrumbProps {
  label?: string;
}

export function Breadcrumb({ label }: BreadcrumbProps) {
  return (
    <nav className="flex items-center font-medium tracking-wide pointer-events-auto group select-none cursor-default">
      <div className="relative flex items-center justify-center mr-2">
        <Milestone
          size={16}
          strokeWidth={2.5}
          // ✨ 这里的类名现在完全是语义化的
          className="transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                      text-header-icon-muted
                      group-hover:text-header-accent
                      group-hover:-translate-y-1
                      group-hover:rotate-12
                      group-hover:drop-shadow-[0_0_8px_var(--color-header-accent)]"
        />
        {/* Nectar Glow 呼吸感 */}
        <div
          className="absolute bottom-1 w-3 h-1 bg-header-accent/0 rounded-full blur-[2px]
                        transition-all duration-300
                        group-hover:bg-header-accent/40 group-hover:scale-150"
        />
      </div>

      {/* 文字颜色也通过语义变量控制 */}
      <span className="text-sm text-header-fg font-bold tracking-tight transition-colors duration-300 group-hover:text-header-fg/80">
        {label}
      </span>
    </nav>
  );
}
