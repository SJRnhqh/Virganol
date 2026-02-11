// apps/ui/src/features/bot/components/forms/ConnectionError.tsx
// TODO: 后续有空对该组件进行重构优化
// 外部依赖
import { X, RotateCcw } from "lucide-react";

interface ConnectionErrorProps {
  message?: string;
  onRetry?: () => void;
}

export const ConnectionError = ({
  message = "Connection failed",
  onRetry,
}: ConnectionErrorProps) => {
  return (
    <div className="pb-2 pl-1 pt-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <X className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span className="text-settings-panel-fg/70">{message}</span>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRetry();
            }}
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 text-settings-panel-fg/50 hover:text-settings-panel-fg/80 hover:bg-settings-panel-fg/5 transition-all duration-200 rounded-md group cursor-pointer"
            title="Retry connection"
          >
            <RotateCcw className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
            <span className="text-xs font-medium">Retry</span>
          </button>
        )}
      </div>
    </div>
  );
};
