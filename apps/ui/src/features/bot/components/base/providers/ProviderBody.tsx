// apps/ui/src/features/bot/components/base/providers/ProviderBody.tsx
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
  ConnectionError,
} from "@/features/bot/components/forms";
import { ConnectButton } from "@/features/bot/components/buttons";

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
        <ConnectButton
          onClick={() => connection.onConnect?.(value)}
          isConnected={false}
          isLoading={false}
        />
      </>
    );
  }

  // pending 状态：显示 loading 状态的 Connect 按钮
  if (cardState === PROVIDER_CARD_STATES.PENDING) {
    return (
      <>
        <div className="w-full border-t border-dashed border-settings-panel-fg/60 mb-4" />
        <ConnectButton
          onClick={() => {}}
          isConnected={false}
          isLoading={true}
        />
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
        <ConnectButton
          onClick={() => connection.onConnect?.(value)}
          isConnected={true}
          isLoading={false}
        />
      </>
    );
  }

  // failed 状态：显示表单 + 错误信息 + Retry 按钮
  if (cardState === PROVIDER_CARD_STATES.FAILED) {
    return (
      <>
        <div className="w-full border-t border-dashed border-settings-panel-fg/60 mb-4" />
        <ProviderFormFields
          fields={fields}
          value={value}
          onChange={onFieldChange}
        />
        <ConnectionError
          message={connection.errorMessage ?? undefined}
          onRetry={() => {
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
