import { Settings } from "lucide-react";

interface SettingsButtonProps {
  onClick?: () => void;
}

/**
 * ⚙️ SettingsButton - 语义化重构版
 * 视觉逻辑完全收拢至 light.css 的 --header-icon 变量
 */
export function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <button
      onClick={onClick}
      // 阻止冒泡，防止触发 WindowHeader 的窗口拖拽
      onMouseDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      /**
       * 1. text-header-icon-muted: 对应 light.css 中的 60% 透明度米色
       * 2. hover:text-header-icon: 悬停时变为 100% 不透明米色
       * 3. hover:bg-parchment-fade: 使用 _palette.css 中新定义的米色温润光晕
       */
      className="group flex items-center justify-center w-10 h-10 rounded-md
                 text-header-icon-muted hover:text-header-icon
                 hover:bg-parchment-fade active:scale-90
                 transition-all duration-300 ease-in-out"
      title="Settings"
    >
      <Settings
        size={22}
        strokeWidth={2}
        className="transition-transform duration-700 ease-in-out group-hover:rotate-90"
      />
    </button>
  );
}
