// apps/ui/src/components/header/SettingsButton.tsx
import { Settings } from "lucide-react";

import { useSmartSettings } from "@/hooks";

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
      className="group flex items-center justify-center w-10 h-8 rounded-md
                 text-header-icon-muted hover:text-header-icon
                 hover:bg-header-icon-bg active:scale-90
                 transition-all duration-300 ease-in-out"
      onClick={handleClick}
      // 阻止冒泡，防止触发 WindowHeader 的窗口拖拽
      onDoubleClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Settings
        className="transition-transform duration-700 ease-in-out group-hover:rotate-90"
        size={22}
        strokeWidth={2}
      />
    </button>
  );
}
