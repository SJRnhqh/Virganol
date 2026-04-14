// apps/ui/src/features/bot/components/forms/ProviderErrorPanel.tsx
// 内部引用
import { cn } from "@/lib";
import type { ProviderErrorPanelProps } from "@/features/bot/types";
import { useProviderReset } from "@/features/bot/hooks";
import { ProviderResetButton } from "./ProviderResetButton";

export const ProviderErrorPanel = ({
  provider,
  errorMessage,
}: ProviderErrorPanelProps) => {
  const handleReset = useProviderReset(provider.id);

  if (!errorMessage) return null;

  return (
    <div
      className={cn(
        // 基础布局
        "pb-2 pl-1 pt-0",
      )}
    >
      <div
        className={cn(
          // 容器样式
          "rounded-lg border border-dashed",
          // 错误态边框颜色
          "border-settings-panel-error/30",
          // 统一背景
          "bg-settings-panel-error/5",
          // 布局与间距
          "px-3 py-2",
        )}
      >
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
        <div className="mt-3">
          <ProviderResetButton onClick={handleReset} />
        </div>
      </div>
    </div>
  );
};
