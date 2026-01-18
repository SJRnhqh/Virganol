import { memo, type ElementType } from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BaseActionCardProps {
  icon: LucideIcon | ElementType;
  badgeIcon?: LucideIcon | ElementType;
  onClick: () => void;
  title: string;
  className?: string;
}

export const BaseActionCard = memo(({ icon: Icon, badgeIcon: BadgeIcon, onClick, title, className }: BaseActionCardProps) => {
  return (
    <div className={cn("relative z-50", className)}>
      <button
        onClick={onClick}
        title={title}
        className="group relative flex items-center justify-center w-16 h-16 
          bg-action-bg text-action-fg 
          rounded-2xl shadow-2xl shadow-action-bg/40 border border-white/5 
          overflow-hidden transition-all duration-300 
          hover:scale-110 hover:-translate-y-2 active:scale-95"
      >
        <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <Icon size={28} strokeWidth={2} className="text-action-fg group-hover:text-white transition-colors" />
          {BadgeIcon && (
            <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-action-badge rounded-full flex items-center justify-center border-2 border-action-bg">
              <BadgeIcon size={8} strokeWidth={4} className="text-white" />
            </div>
          )}
        </div>
      </button>
    </div>
  );
});