// apps/ui/src/features/bot/components/settings/provider/content/cards/ProviderResetButton.tsx
// 外部依赖
import { Eraser } from "lucide-react";

// 内部引用
import { cn } from "@/lib";
import type { ProviderResetButtonProps } from "@/features/bot/types";

export const ProviderResetButton = ({ onClick }: ProviderResetButtonProps) => {
  return (
    <button
      type="button"
      aria-label="Reset provider"
      onClick={() => {
        void onClick?.();
      }}
      className={cn(
        "inline-flex items-center justify-center w-7 h-7 rounded-md",
        "text-settings-panel-fg/40 hover:text-settings-panel-fg/70",
        "hover:bg-settings-panel-fg/5",
      )}
    >
      <Eraser className="w-3.5 h-3.5" />
    </button>
  );
};
