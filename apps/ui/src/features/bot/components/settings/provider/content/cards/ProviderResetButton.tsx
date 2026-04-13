// apps/ui/src/features/bot/components/settings/provider/content/cards/ProviderResetButton.tsx
// 外部依赖
import { Eraser } from "lucide-react";

// 内部引用
import { cn } from "@/lib";
import type { ProviderResetButtonProps } from "@/features/bot/types";

/**
 * Provider 配置重置按钮
 *
 * 显示 "Reset" 文字 + Eraser 图标，用于配置管理区域
 */
export const ProviderResetButton = ({ onClick }: ProviderResetButtonProps) => {
  return (
    <button
      type="button"
      aria-label="Reset provider configuration"
      onClick={() => {
        void onClick?.();
      }}
      className={cn(
        // 布局
        "flex items-center gap-1.5 px-2 py-1 rounded-md",
        // 文本样式
        "text-xs font-medium text-settings-panel-fg/50",
        // 交互状态
        "hover:text-settings-panel-fg/80 hover:bg-settings-panel-fg/5",
        "transition-all duration-200",
      )}
    >
      <span>Reset</span>
      <Eraser className="w-3.5 h-3.5" />
    </button>
  );
};
