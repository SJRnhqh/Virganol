// apps/ui/src/features/bot/components/settings/provider/content/cards/ProviderCardBody.tsx
// 内部引用
import type {
  ProviderCardState,
  ProviderCardBodyProps,
  ProviderConnectionButtonProps,
} from "@/features/bot/types";
import { PROVIDER_CARD_STATES } from "@/features/bot/constants";
import { ProviderConnectionButton } from "./ProviderConnectionButton";
import { ProviderCardContent } from "./ProviderCardContent";

export const ProviderCardBody = ({
  provider,
  cardState,
  form,
  errorMessage,
  connection,
}: ProviderCardBodyProps) => {
  // 渲染内容
  const renderContent = () => {
    switch (cardState) {
      case PROVIDER_CARD_STATES.UNSET:
      case PROVIDER_CARD_STATES.PENDING:
        return <ProviderCardContent cardState={cardState} cardContent={form} />;

      case PROVIDER_CARD_STATES.CONNECTED:
        return (
          <ProviderCardContent
            cardState={cardState}
            cardContent={{
              provider,
              form,
            }}
          />
        );

      case PROVIDER_CARD_STATES.FAILED:
        return (
          <ProviderCardContent
            cardState={cardState}
            cardContent={{ errorMessage }}
          />
        );

      default:
        return null;
    }
  };

  const buttonClickHandlers = {
    [PROVIDER_CARD_STATES.UNSET]: () => connection.onConnect?.(form.formData),
    [PROVIDER_CARD_STATES.PENDING]: undefined,
    [PROVIDER_CARD_STATES.CONNECTED]: () =>
      connection.onConnect?.(form.formData),
    [PROVIDER_CARD_STATES.FAILED]: () => {
      connection.onErrorReset?.();
      connection.onConnect?.(form.formData);
    },
  } satisfies Record<
    ProviderCardState,
    ProviderConnectionButtonProps["onClick"] | undefined
  >;

  const content = renderContent();
  const button = (
    <ProviderConnectionButton
      cardState={cardState}
      onClick={buttonClickHandlers[cardState]}
    />
  );

  // 如果没有内容，直接返回 null
  if (!content) return null;

  return (
    <>
      <div className="w-full border-t border-dashed border-settings-panel-fg/60 mb-4" />
      {content}
      {button}
    </>
  );
};
