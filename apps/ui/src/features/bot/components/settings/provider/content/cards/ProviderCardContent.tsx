// apps/ui/src/features/bot/components/settings/provider/content/cards/ProviderCardContent.tsx
// 内部引用
import type { ProviderCardContentProps } from "@/features/bot/types";
import { PROVIDER_CARD_STATES } from "@/features/bot/constants";
import { ProviderErrorPanel } from "./ProviderErrorPanel";
import { ProviderConnectedPanel } from "./ProviderConnectedPanel";
import { ProviderForm } from "./ProviderForm";

export const ProviderCardContent = ({
  cardState,
  cardContent,
}: ProviderCardContentProps) => {
  switch (cardState) {
    case PROVIDER_CARD_STATES.UNSET:
    case PROVIDER_CARD_STATES.PENDING:
      return <ProviderForm cardState={cardState} form={cardContent} />;

    case PROVIDER_CARD_STATES.CONNECTED:
      return (
        <ProviderConnectedPanel
          provider={cardContent.provider}
          connectionInfo={cardContent.connectionInfo}
        />
      );

    case PROVIDER_CARD_STATES.FAILED:
      return (
        <ProviderErrorPanel
          provider={cardContent.provider}
          errorMessage={cardContent.errorMessage}
        />
      );
  }
};
