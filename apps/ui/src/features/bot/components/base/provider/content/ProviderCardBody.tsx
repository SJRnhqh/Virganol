// apps/ui/src/features/bot/components/base/provider/content/ProviderCardBody.tsx
// 内部引用
import type {
  ProviderField,
  ProviderFormData,
  ProviderCardState,
  ProviderModelProps,
  ProviderConnectionProps,
} from "@/features/bot/types";
import { PROVIDER_CARD_STATES } from "@/features/bot/constants";
import { ProviderConnectionButton } from "@/features/bot/components/buttons";
import { ProviderCardContent } from "./ProviderCardContent";

interface ProviderCardBodyProps {
  cardState: ProviderCardState;
  fields: ProviderField[];
  formData: ProviderFormData;
  updateFormData: (formData: ProviderFormData) => void;
  onReset: () => void;
  connection: ProviderConnectionProps;
  models: ProviderModelProps;
}

export const ProviderCardBody = ({
  cardState,
  fields,
  formData,
  updateFormData,
  onReset,
  connection,
  models,
}: ProviderCardBodyProps) => {
  const handleFieldChange = (key: keyof ProviderFormData, val: string) => {
    updateFormData({ ...formData, [key]: val });
  };

  switch (cardState) {
    case PROVIDER_CARD_STATES.UNSET:
      // unset 状态：显示表单 + Connect 按钮
      return (
        <>
          <div className="w-full border-t border-dashed border-settings-panel-fg/60 mb-4" />
          <ProviderCardContent
            cardState={cardState}
            cardContent={{
              fields,
              formData,
              onChange: handleFieldChange,
            }}
          />
          <ProviderConnectionButton
            cardState={cardState}
            onClick={() => connection.onConnect?.(formData)}
          />
        </>
      );

    case PROVIDER_CARD_STATES.PENDING:
      // pending 状态：显示表单（loading 遮罩）+ Connecting 按钮
      return (
        <>
          <div className="w-full border-t border-dashed border-settings-panel-fg/60 mb-4" />
          <ProviderCardContent
            cardState={cardState}
            cardContent={{
              fields,
              formData,
              onChange: handleFieldChange,
            }}
          />
          <ProviderConnectionButton cardState={cardState} />
        </>
      );

    case PROVIDER_CARD_STATES.CONNECTED:
      // connected 状态：显示模型列表面板 + Reconnect 按钮
      return (
        <>
          <div className="w-full border-t border-dashed border-settings-panel-fg/60 mb-4" />
          <ProviderCardContent
            cardState={cardState}
            cardContent={{
              fields,
              value: formData,
              onReset,
              models: models.available,
              enabledModels: models.enabled,
              onToggleModel: models.onToggle,
              onToggleAll: models.onToggleAll,
            }}
          />
          <ProviderConnectionButton
            cardState={cardState}
            onClick={() => connection.onConnect?.(formData)}
          />
        </>
      );

    case PROVIDER_CARD_STATES.FAILED:
      // failed 状态：显示错误面板 + Retry 按钮
      return (
        <>
          <div className="w-full border-t border-dashed border-settings-panel-fg/60 mb-4" />
          <ProviderCardContent
            cardState={cardState}
            cardContent={{
              errorMessage: connection.errorMessage,
            }}
          />
          <ProviderConnectionButton
            cardState={cardState}
            onClick={() => {
              connection.onErrorReset?.();
              connection.onConnect?.(formData);
            }}
          />
        </>
      );

    default:
      // 兜底：理论上不应该到这里
      return null;
  }
};
