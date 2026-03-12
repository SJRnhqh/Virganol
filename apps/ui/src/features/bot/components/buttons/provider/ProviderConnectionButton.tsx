// apps/ui/src/features/bot/components/buttons/provider/ProviderConnectionButton.tsx
// 内部引用
import { PROVIDER_CARD_STATES } from "@/features/bot/constants";
import type { ProviderCardState } from "@/features/bot/types";
import {
  ConnectButton,
  ConnectingButton,
  ReconnectButton,
  RetryButton,
} from "./connection";

interface ProviderConnectionButtonProps {
  cardState: ProviderCardState;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ProviderConnectionButton = ({
  cardState,
  onClick,
}: ProviderConnectionButtonProps) => {
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
