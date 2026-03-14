// apps/ui/src/features/bot/components/base/provider/content/ProviderCardContent.tsx
// 内部引用
import type { ProviderCardContentProps } from "@/features/bot/types";
import { PROVIDER_CARD_STATES } from "@/features/bot/constants";
import {
  ProviderErrorPanel,
  ProviderConnectedPanel,
  ProviderForm,
} from "@/features/bot/components/forms";

export const ProviderCardContent = ({
  cardState,
  cardContent,
}: ProviderCardContentProps) => {
  switch (cardState) {
    case PROVIDER_CARD_STATES.UNSET:
    case PROVIDER_CARD_STATES.PENDING:
      return <ProviderForm cardState={cardState} {...cardContent} />;

    case PROVIDER_CARD_STATES.CONNECTED:
      return (
        <ProviderConnectedPanel
          fields={cardContent.fields}
          value={cardContent.value}
          models={cardContent.models}
          enabledModels={cardContent.enabledModels}
          onToggleModel={cardContent.onToggleModel}
          onToggleAll={cardContent.onToggleAll}
          onReset={cardContent.onReset}
        />
      );

    case PROVIDER_CARD_STATES.FAILED:
      return (
        <ProviderErrorPanel
          cardState={cardState}
          errorMessage={cardContent.errorMessage}
        />
      );

    default:
      return null;
  }
};
