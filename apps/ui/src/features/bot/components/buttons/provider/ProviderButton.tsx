// apps/ui/src/features/bot/components/buttons/provider/ProviderButton.tsx
// 内部引用
import {
  PROVIDER_CARD_STATES,
  type ProviderCardState,
} from "@/features/bot/constants";
import {
  ConnectButton,
  ConnectingButton,
  ReconnectButton,
  RetryButton,
} from "./connection";

interface ProviderButtonProps {
  cardState: ProviderCardState;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ProviderButton = ({ cardState, onClick }: ProviderButtonProps) => {
  // 根据 cardState 渲染对应的具体按钮
  switch (cardState) {
    case PROVIDER_CARD_STATES.UNSET:
      return <ConnectButton onClick={onClick} />;

    case PROVIDER_CARD_STATES.PENDING:
      return <ConnectingButton />;

    case PROVIDER_CARD_STATES.CONNECTED:
      return <ReconnectButton onClick={onClick} />;

    case PROVIDER_CARD_STATES.FAILED:
      return <RetryButton onClick={onClick} />;

    default:
      return null;
  }
};
