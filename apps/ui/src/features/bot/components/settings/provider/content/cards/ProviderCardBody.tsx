// apps/ui/src/features/bot/components/settings/provider/content/cards/ProviderCardBody.tsx
// 内部引用
import type {
  ProviderCardBodyProps,
  ProviderCardActionsPropsByState,
  ProviderCardContentPropsByState,
} from "@/features/bot/types";
import { PROVIDER_CARD_STATES } from "@/features/bot/constants";
import { ProviderCardActions } from "./ProviderCardActions";
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
      cardContent: { provider, errorMessage },
    },
  } satisfies ProviderCardContentPropsByState;

  const actionsPropsByState = {
    [PROVIDER_CARD_STATES.UNSET]: {
      cardState: PROVIDER_CARD_STATES.UNSET,
      actions: {
        primaryAction: () => connection.onConnect?.(form.formData),
      },
    },
    [PROVIDER_CARD_STATES.PENDING]: {
      cardState: PROVIDER_CARD_STATES.PENDING,
      actions: {
        primaryAction: undefined,
      },
    },
    [PROVIDER_CARD_STATES.CONNECTED]: {
      cardState: PROVIDER_CARD_STATES.CONNECTED,
      actions: {
        primaryAction: () => connection.onConnect?.(form.formData),
        resetAction: () => connection.onReset?.(),
      },
    },
    [PROVIDER_CARD_STATES.FAILED]: {
      cardState: PROVIDER_CARD_STATES.FAILED,
      actions: {
        primaryAction: () => connection.onRetry?.(form.formData),
        resetAction: () => connection.onReset?.(),
      },
    },
  } satisfies ProviderCardActionsPropsByState;

  const content = <ProviderCardContent {...contentPropsByState[cardState]} />;
  const actions = <ProviderCardActions {...actionsPropsByState[cardState]} />;

  return (
    <>
      <div className="w-full border-t border-dashed border-settings-panel-fg/60 mb-4" />
      {content}
      {actions}
    </>
  );
};
