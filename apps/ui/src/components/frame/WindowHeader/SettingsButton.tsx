import { Settings } from "lucide-react";

interface SettingsButtonProps {
  onClick?: () => void;
}

export function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <button
      onClick={onClick}
      onMouseDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      // bg-white/10 在 Sage 背景上会自然混合出一种浅绿色的高光
      className="group flex items-center justify-center w-10 h-10 rounded-md
                 text-parchment/70 hover:text-parchment
                 hover:bg-white/10 active:scale-90
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
