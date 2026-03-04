// apps/ui/src/features/bot/components/buttons/provider/ReconnectButton.tsx
// 外部依赖
import { Check, RotateCcw } from "lucide-react";

// 内部引用
import { BaseProviderButton } from "@/features/bot/components/base/provider/common";

interface ReconnectButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ReconnectButton = ({ onClick }: ReconnectButtonProps) => {
  return (
    <BaseProviderButton onClick={onClick}>
      <Check className="w-3.5 h-3.5 text-settings-panel-check" />
      Connected
      <RotateCcw className="w-3.5 h-3.5" />
    </BaseProviderButton>
  );
};
