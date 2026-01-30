// apps/ui/src/components/frame/WindowHeader/SettingsButton.tsx
import { Settings } from "lucide-react";
import { useSmartSettings } from "../../../hooks/useSmartSettings";

interface SettingsButtonProps {
  onClick?: () => void;
}

export function SettingsButton({ onClick }: SettingsButtonProps) {
  // 1. 引入业务逻辑 Hook
    const { openContextAwareSettings } = useSmartSettings();
  
  const handleClick = () => {
    // 如果外部传入了 onClick，优先执行外部逻辑（通常不需要）
    if (onClick) {
      onClick();
      return;
    }

    // 执行智能打开逻辑
    openContextAwareSettings();
  };
  
  return (
    <button
      onClick={handleClick}
      // 阻止冒泡，防止触发 WindowHeader 的窗口拖拽
      onMouseDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      className="group flex items-center justify-center w-10 h-8 rounded-md
                 text-header-icon-muted hover:text-header-icon
                 hover:bg-header-icon-bg active:scale-90
                 transition-all duration-300 ease-in-out"
    >
      <Settings
        size={22}
        strokeWidth={2}
        className="transition-transform duration-700 ease-in-out group-hover:rotate-90"
      />
      </button>
  );
}
