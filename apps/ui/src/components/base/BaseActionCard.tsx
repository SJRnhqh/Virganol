import { memo, type ElementType } from 'react';
import { type LucideIcon } from 'lucide-react';

interface BaseActionCardProps {
  icon: LucideIcon | ElementType;    // 主图标
  badgeIcon?: LucideIcon | ElementType; // 可选的角标图标
  onClick: () => void;               // 点击动作
  title: string;                     // 悬浮提示
  active?: boolean;                  // 是否处于激活状态（预留）
  className?: string;                // 允许外部微调定位样式
}

export const BaseActionCard = memo(({
  icon: Icon,
  badgeIcon: BadgeIcon,
  onClick,
  title,
  className = ""
}: BaseActionCardProps) => {
  return (
    // 💡 移除 fixed 定位，让其由外部容器（如 NodeDashboard）决定位置
    <div className={`relative z-50 ${className}`}>
      <button
        onClick={onClick}
        title={title}
        className="group relative flex items-center justify-center w-16 h-16 
          bg-[#2F3E46] text-[#FAF7F0] 
          rounded-2xl shadow-2xl shadow-[#2F3E46]/40 border border-[#E6E1D3]/10 
          overflow-hidden transition-all duration-300 
          hover:scale-110 hover:-translate-y-2 hover:shadow-emerald-900/50 active:scale-95"
      >
        {/* 背景流光效果 */}
        <div className="absolute inset-0 bg-linear-to-tr from-transparent via-[#84A59D]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* 核心图标区域 */}
        <div className="relative z-10">
          <Icon size={28} strokeWidth={2} className="text-[#FAF7F0] group-hover:text-white transition-colors" />
          
          {/* 动态渲染角标 */}
          {BadgeIcon && (
            <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-[#84A59D] rounded-full flex items-center justify-center border-2 border-[#2F3E46]">
              <BadgeIcon size={8} strokeWidth={4} className="text-white" />
            </div>
          )}
        </div>
      </button>
    </div>
  );
});