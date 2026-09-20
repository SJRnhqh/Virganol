// apps/ui/src/components/frame/MainStage/DevelopingView.tsx
import { type LucideIcon, Rocket } from "lucide-react";

/** Placeholder view shown for decks that are still under development.
 *
 * 尚未开发的工位所显示的占位视图。
 */
export const DevelopingView = ({ title, icon: Icon }: DevelopingViewProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-main-bg animate-in fade-in zoom-in duration-500">
      <div className="relative mb-6">
        <Icon size={80} className="text-primary/10" strokeWidth={1} />
        <Rocket size={24} className="absolute -top-2 -right-2 text-rose-400 animate-bounce" />
      </div>

      <h2 className="text-xl font-medium text-primary/60 tracking-tight">{title}</h2>

      <p className="mt-2 text-sm text-primary/30 font-light italic">
        "Refining Nectar into specialized Mead... the brewing takes time."
      </p>
    </div>
  );
};

/** Props for the developing-deck placeholder view.
 *
 * 未开发工位占位视图的属性。
 */
interface DevelopingViewProps {
  /**
   * Title displayed under the icon.
   *
   * 图标下方显示的标题。
   */
  title: string;
  /**
   * Lucide icon rendered as the background glyph.
   *
   * 作为背景大图标渲染的图标组件。
   */
  icon: LucideIcon;
}
