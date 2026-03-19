// apps/ui/src/features/bot/components/settings/provider/content/cards/ProviderCardBody.tsx
// 内部引用
import type {
  ProviderCardState,
  ProviderCardBodyProps,
  ProviderCardContentPropsByState,
  ProviderConnectionButtonProps,
} from "@/features/bot/types";
import { PROVIDER_CARD_STATES } from "@/features/bot/constants";
import { ProviderConnectionButton } from "./ProviderConnectionButton";
import { ProviderCardContent } from "./ProviderCardContent";

export const ProviderCardBody = ({
  cardState,
  provider,
  form,
  errorMessage,
  connection,
}: ProviderCardBodyProps) => {
  const contentPropsByState = {
    [PROVIDER_CARD_STATES.UNSET]: {
      cardState: PROVIDER_CARD_STATES.UNSET,
      cardContent: form,
    },
    [PROVIDER_CARD_STATES.PENDING]: {
      cardState: PROVIDER_CARD_STATES.PENDING,
      cardContent: form,
    },
    [PROVIDER_CARD_STATES.CONNECTED]: {
      cardState: PROVIDER_CARD_STATES.CONNECTED,
      cardContent: {
        provider,
        connectionInfo: {
          apiURL: form.formData.apiURL,
        },
      },
    },
    [PROVIDER_CARD_STATES.FAILED]: {
      cardState: PROVIDER_CARD_STATES.FAILED,
      cardContent: { errorMessage },
    },
  } satisfies ProviderCardContentPropsByState;

  const buttonClickHandlers = {
    [PROVIDER_CARD_STATES.UNSET]: () => connection.onConnect?.(form.formData),
    [PROVIDER_CARD_STATES.PENDING]: undefined,
    [PROVIDER_CARD_STATES.CONNECTED]: () =>
      connection.onConnect?.(form.formData),
    [PROVIDER_CARD_STATES.FAILED]: () => connection.onRetry?.(form.formData),
  } satisfies Record<
    ProviderCardState,
    ProviderConnectionButtonProps["onClick"] | undefined
  >;

  const content = <ProviderCardContent {...contentPropsByState[cardState]} />;
  const button = (
    <ProviderConnectionButton
      cardState={cardState}
      onClick={buttonClickHandlers[cardState]}
    />
  );

  return (
    <>
      <div className="w-full border-t border-dashed border-settings-panel-fg/60 mb-4" />
      {content}
      {button}
    </>
  );
};
