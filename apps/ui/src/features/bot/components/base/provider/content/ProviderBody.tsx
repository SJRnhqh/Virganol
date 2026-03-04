// apps/ui/src/features/bot/components/base/provider/content/ProviderBody.tsx
// 内部引用
import type {
  ProviderField,
  ProviderConnectionProps,
  ProviderModelProps,
} from "@/features/bot/types";
import {
  PROVIDER_CARD_STATES,
  type ProviderCardState,
} from "@/features/bot/constants";
import {
  ProviderFormFields,
  ProviderConnectedPanel,
} from "@/features/bot/components/forms";
import { ProviderButton } from "@/features/bot/components/buttons";

interface ProviderBodyProps {
  cardState: ProviderCardState;
  fields: ProviderField[];
  value: Record<string, string>;
  onFieldChange: (key: string, val: string) => void;
  onReset: () => void;
  connection: ProviderConnectionProps;
  models: ProviderModelProps;
}

export const ProviderBody = ({
  cardState,
  fields,
  value,
  onFieldChange,
  onReset,
  connection,
  models,
}: ProviderBodyProps) => {
  // unset 状态：显示表单 + Connect 按钮
  if (cardState === PROVIDER_CARD_STATES.UNSET) {
    return (
      <>
        <div className="w-full border-t border-dashed border-settings-panel-fg/60 mb-4" />
        <ProviderFormFields
          fields={fields}
          value={value}
          onChange={onFieldChange}
        />
        <ProviderButton
          cardState={cardState}
          onClick={() => connection.onConnect?.(value)}
        />
      </>
    );
  }

  // pending 状态：显示 loading 状态的按钮
  if (cardState === PROVIDER_CARD_STATES.PENDING) {
    return (
      <>
        <div className="w-full border-t border-dashed border-settings-panel-fg/60 mb-4" />
        <ProviderButton cardState={cardState} />
      </>
    );
  }

  // connected 状态：显示模型列表面板 + Reconnect 按钮
  if (cardState === PROVIDER_CARD_STATES.CONNECTED) {
    return (
      <>
        <div className="w-full border-t border-dashed border-settings-panel-fg/60 mb-4" />
        <ProviderConnectedPanel
          fields={fields}
          value={value}
          onReset={onReset}
          models={models.available}
          enabledModels={models.enabled}
          onToggleModel={models.onToggle}
          onToggleAll={models.onToggleAll}
        />
        <ProviderButton
          cardState={cardState}
          onClick={() => connection.onConnect?.(value)}
        />
      </>
    );
  }

  // failed 状态：显示表单 + Retry 按钮
  if (cardState === PROVIDER_CARD_STATES.FAILED) {
    return (
      <>
        <div className="w-full border-t border-dashed border-settings-panel-fg/60 mb-4" />
        <ProviderFormFields
          fields={fields}
          value={value}
          onChange={onFieldChange}
        />
        {/* TODO: 错误信息展示待设计 */}
        <ProviderButton
          cardState={cardState}
          onClick={() => {
            connection.onErrorReset?.();
            connection.onConnect?.(value);
          }}
        />
      </>
    );
  }

  // 兜底：理论上不应该到这里
  return null;
};
