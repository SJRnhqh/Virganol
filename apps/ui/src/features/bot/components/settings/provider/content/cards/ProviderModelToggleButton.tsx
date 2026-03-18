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
      onClick={onClick}
      className={cn(
        // 基础布局
        "inline-flex items-center justify-center",
        "w-5 h-5",
        // 文本样式
        "text-settings-panel-fg/60",
        // 光标
        "cursor-pointer",
      )}
    >
      {checked ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
    </button>
  );
};
