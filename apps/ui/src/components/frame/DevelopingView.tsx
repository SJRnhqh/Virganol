import { type LucideIcon, Rocket } from "lucide-react";

interface DevelopingViewProps {
  title: string;
  icon: LucideIcon;
}

export const DevelopingView = ({ title, icon: Icon }: DevelopingViewProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-main-bg animate-in fade-in zoom-in duration-500">
      <div className="relative mb-6">
        {/* 背景大图标 */}
        <Icon size={80} className="text-primary/10" strokeWidth={1} />
        {/* 动画小火箭 */}
        <Rocket
          size={24}
          className="absolute -top-2 -right-2 text-rose-400 animate-bounce"
        />
      </div>

      <h2 className="text-xl font-medium text-primary/60 tracking-tight">
        {title}
      </h2>

      {/* 🔴 更新后的文案，契合 V.I.N.E. 的酿造哲学 */}
      <p className="mt-2 text-sm text-primary/30 font-light italic">
        "Refining Nectar into specialized Mead... the brewing takes time."
      </p>
    </div>
  );
};
