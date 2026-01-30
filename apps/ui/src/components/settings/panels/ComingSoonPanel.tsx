import { type LucideIcon, Rocket } from "lucide-react";

interface ComingSoonPanelProps {
  name: string;
  icon: LucideIcon;
}

export const ComingSoonPanel = ({ name, icon: Icon }: ComingSoonPanelProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full animate-in fade-in zoom-in duration-500">
      <div className="relative mb-6">
        {/* 面板对应的图标 */}
        <Icon size={48} className="text-primary/60" />
        {/* 动画小火箭 */}
        <Rocket
          size={24}
          className="absolute -top-2 -right-2 text-rose-400 animate-bounce"
        />
      </div>

      <h2 className="text-xl font-medium text-primary/60 tracking-tight">
        {name}
      </h2>

      <p className="mt-2 text-sm text-primary/30 font-light italic">
        "Refining Nectar into specialized Mead... the brewing takes time."
      </p>
    </div>
  );
};