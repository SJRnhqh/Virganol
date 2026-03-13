// apps/ui/src/features/bot/components/forms/ProviderErrorPanel.tsx
// 内部引用
import { AlertCircle } from "lucide-react";

interface ProviderErrorPanelProps {
  errorMessage?: string | null;
}

export const ProviderErrorPanel = ({
  errorMessage,
}: ProviderErrorPanelProps) => {
  if (!errorMessage) return null;

  return (
    <div className="pb-2 pl-1 pt-0">
      <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-settings-panel-error/10 border border-settings-panel-error/30">
        <AlertCircle className="w-5 h-5 text-settings-panel-error shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-settings-panel-error mb-1">
            Connection Failed
          </p>
          <p className="text-xs text-settings-panel-error/70 leading-relaxed">
            {errorMessage}
          </p>
        </div>
      </div>
    </div>
  );
};
