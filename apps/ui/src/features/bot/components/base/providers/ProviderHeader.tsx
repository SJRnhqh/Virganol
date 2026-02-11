// apps/ui/src/features/bot/components/base/providers/ProviderHeader.tsx
// 外部依赖
import { Check } from "lucide-react";

interface ProviderHeaderProps {
  icon: React.ReactNode;
  name: string;
  isConnected: boolean;
  open: boolean;
}

export const ProviderHeader = ({
  icon,
  name,
  isConnected,
  open,
}: ProviderHeaderProps) => (
  <div className="flex items-center gap-3.5">
    <span
      className={[
        "transition-colors duration-200",
        open
          ? "text-settings-panel-fg"
          : "text-settings-panel-fg/60 group-hover:text-settings-panel-fg",
      ].join(" ")}
    >
      {icon}
    </span>
    <div className="flex items-center gap-2">
      <span
        className={[
          "text-sm font-medium transition-colors",
          open
            ? "text-settings-panel-fg"
            : "text-settings-panel-fg/60 group-hover:text-settings-panel-fg",
        ].join(" ")}
      >
        {name}
      </span>
      {isConnected && !open && (
        <Check className="w-4 h-4 text-settings-panel-check" />
      )}
    </div>
  </div>
);

