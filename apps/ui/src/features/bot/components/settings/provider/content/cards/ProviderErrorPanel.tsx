// apps/ui/src/features/bot/components/forms/ProviderErrorPanel.tsx
// 内部引用
import type { ProviderErrorPanelProps } from "@/features/bot/types";
import { PROVIDER_CARD_STATE_ICONS } from "@/features/bot/icons";
import { cn } from "@/lib";

export const ProviderErrorPanel = ({
  cardState,
  errorMessage,
}: ProviderErrorPanelProps) => {
  if (!errorMessage) return null;

  const iconSlot = PROVIDER_CARD_STATE_ICONS[cardState];
  const ErrorIcon = iconSlot?.icon;

  return (
    <div
      className={cn(
        // 基础布局
        "pb-2 pl-1 pt-0",
      )}
    >
      <div
        className={cn(
          // 布局与间距
          "flex items-start gap-3 px-4 py-3 rounded-lg",
          // 错误态视觉
          "bg-settings-panel-error/10 border border-settings-panel-error/30",
        )}
      >
        {ErrorIcon && (
          <ErrorIcon
            className={cn(
              // 图标尺寸与定位
              "w-5 h-5 shrink-0 mt-0.5",
              // 错误态颜色
              iconSlot.className,
            )}
          />
        )}
        <div className="flex-1">
          <p
            className={cn(
              // 标题排版
              "text-sm font-semibold mb-1",
              // 错误态颜色
              "text-settings-panel-error",
            )}
          >
            Connection Failed
          </p>
          <p
            className={cn(
              // 正文排版
              "text-xs leading-relaxed",
              // 错误态颜色
              "text-settings-panel-error/70",
            )}
          >
            {errorMessage}
          </p>
        </div>
      </div>
    </div>
  );
};
