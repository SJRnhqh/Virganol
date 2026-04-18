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
export const ProviderResetButton = ({
  onClick,
  variant = "default",
}: ProviderResetButtonProps) => {
  return (
    <button
      type="button"
      onClick={() => {
        void onClick?.();
      }}
      className={cn(
        // 布局
        "flex items-center gap-1.5 px-2 py-1 rounded-md",
        // 文本样式
        "text-xs font-medium",
        // 交互状态
        "transition-all duration-200",
        // 变体样式
        variant === "error"
          ? [
              // 错误变体（红色系，用于 ErrorPanel）
              "text-settings-panel-error/60",
              "hover:text-settings-panel-error hover:bg-settings-panel-error/10",
            ]
          : [
              // 默认变体（灰色系，用于 ConnectedPanel）
              "text-settings-panel-fg/50",
              "hover:text-settings-panel-fg/80 hover:bg-settings-panel-fg/5",
            ],
      )}
    >
      <span>Reset</span>
      <Eraser className="w-3.5 h-3.5" />
    </button>
  );
};
