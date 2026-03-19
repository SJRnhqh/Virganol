// apps/ui/src/features/bot/components/settings/provider/content/cards/ProviderCardActions.tsx
// 内部引用
import type { ProviderCardActionsProps } from "@/features/bot/types";
import { PROVIDER_CARD_STATES } from "@/features/bot/constants";
import { ProviderConnectionButton } from "./ProviderConnectionButton";
import { ProviderResetButton } from "./ProviderResetButton";

export const ProviderCardActions = ({
  cardState,
  actions,
}: ProviderCardActionsProps) => {
  switch (cardState) {
    case PROVIDER_CARD_STATES.UNSET:
    case PROVIDER_CARD_STATES.PENDING:
      return (
        <div className="px-5 pb-2 pt-0 flex justify-end">
          <ProviderConnectionButton
            cardState={cardState}
            onClick={actions.primaryAction}
          />
        </div>
      );

    case PROVIDER_CARD_STATES.CONNECTED:
    case PROVIDER_CARD_STATES.FAILED:
      return (
        <div className="px-5 pb-2 pt-0 flex items-center justify-end gap-1">
          <ProviderConnectionButton
            cardState={cardState}
            onClick={actions.primaryAction}
          />
          <ProviderResetButton onClick={actions.resetAction} />
        </div>
      );
  }
};
