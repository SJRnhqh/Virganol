import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableMenuSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const ExpandableMenuSection = ({
  title,
  icon,
  children,
  defaultOpen = false,
  className,
}: ExpandableMenuSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn(
      "w-full transition-all duration-300",
      // 变化：使用 #5b4913 的极低透明度 (5%) 作为背景，模拟纸张水印效果
      isOpen ? "bg-[#5b4913]/5 shadow-sm" : "hover:bg-[#5b4913]/5 bg-transparent",
      className
    )}>
      {/* Header Area */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 group outline-none cursor-pointer select-none"
      >
        <div className="flex items-center gap-3.5">
          {/* Icon */}
          {icon && (
            <div className={cn(
                "transition-colors duration-200",
                // 变化：图标颜色统一为 #5b4913
                isOpen ? "text-[#5b4913]" : "text-[#5b4913]/60 group-hover:text-[#5b4913]"
            )}>
              {icon}
            </div>
          )}
          
          {/* Title */}
          <span className={cn(
              "text-sm font-medium transition-colors",
              // 变化：文字颜色统一为 #5b4913
              isOpen ? "text-[#5b4913]" : "text-[#5b4913]/60 group-hover:text-[#5b4913]"
          )}>
            {title}
          </span>
        </div>

        {/* Arrow */}
        <ChevronDown
          size={14}
          strokeWidth={2}
          className={cn(
            "text-[#5b4913]/40 transition-transform duration-300 ease-[cubic-bezier(0.87,0,0.13,1)]",
            isOpen && "rotate-180 text-[#5b4913]/80"
          )}
        />
      </button>

      {/* Content Area */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-[cubic-bezier(0.87,0,0.13,1)]",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden px-5">
            {/* 虚线分割线：使用 #5b4913 的 10% 透明度 */}
            <div className="w-full border-t border-dashed border-[#5b4913]/10 mb-4" />
            
            <div className="pb-5 pl-1">
                {children}
            </div>
        </div>
      </div>
    </div>
  );
};