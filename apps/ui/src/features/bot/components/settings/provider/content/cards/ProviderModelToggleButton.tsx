// apps/ui/src/features/bot/components/settings/provider/content/cards/ProviderModelToggleButton.tsx
// 外部依赖
import { Minus, Plus } from "lucide-react";

// 内部引用
import { cn } from "@/lib";
import type { ProviderModelToggleButtonProps } from "@/features/bot/types";

export const ProviderModelToggleButton = ({
  checked,
  role,
  onClick,
}: ProviderModelToggleButtonProps) => {
  return (
    <button
      type="button"
      role={role}
      aria-checked={checked}
      onClick={() => void onClick()}
      className={cn(
        // 基础布局
        "inline-flex items-center justify-center",
        "w-5 h-5 rounded-md",
        // 文本样式
        "text-settings-panel-fg/60 hover:text-settings-panel-fg/85",
        // 交互反馈
        "hover:bg-settings-panel-fg/8 active:scale-95",
        "transition-[color,background-color,transform] duration-150",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-settings-panel-fg/20",
        // 光标
        "cursor-pointer",
      )}
    >
      {checked ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
    </button>
  );
};
