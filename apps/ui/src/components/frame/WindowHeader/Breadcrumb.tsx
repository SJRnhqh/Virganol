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
          // 移除硬编码，改用语义化的米色 (parchment)
          className="transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                      text-parchment/40
                      group-hover:text-emerald
                      group-hover:-translate-y-1
                      group-hover:rotate-12
                      group-hover:drop-shadow-[0_0_8px_var(--color-emerald)]"
        />
        {/* 使用调色板中的 emerald 产生 Nectar Glow */}
        <div
          className="absolute bottom-1 w-3 h-1 bg-emerald/0 rounded-full blur-[2px]
                        transition-all duration-300
                        group-hover:bg-emerald/40 group-hover:scale-150"
        />
      </div>

      {/* 使用主题定义的 header-fg (深炭灰) */}
      <span className="text-sm text-header-fg font-bold tracking-tight transition-colors duration-300 group-hover:text-header-fg/80">
        {label}
      </span>
    </nav>
  );
}
