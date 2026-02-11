// apps/ui/src/features/bot/components/base/providers/ProviderBody.tsx
// 内部引用
import type {
  ProviderField,
  ProviderConnectionProps,
  ProviderModelProps,
} from "@/features/bot/types/providers";
import { ProviderFormFields } from "../../forms/ProviderFormFields";
import { ProviderConnectedPanel } from "../../forms/ProviderConnectedPanel";
import { ConnectionError } from "../../forms/ConnectionError";
import { ConnectButton } from "../../buttons/Connect";

interface ProviderBodyProps {
  fields: ProviderField[];
  value: Record<string, string>;
  onFieldChange: (key: string, val: string) => void;
  onReset: () => void;
  connection: ProviderConnectionProps;
  models: ProviderModelProps;
}

export const ProviderBody = ({
  fields,
  value,
  onFieldChange,
  onReset,
  connection,
  models,
}: ProviderBodyProps) => (
  <>
    <div className="w-full border-t border-dashed border-settings-panel-fg/60 mb-4" />

    {connection.isConnected ? (
      <ProviderConnectedPanel
        fields={fields}
        value={value}
        onReset={onReset}
        models={models.available}
        enabledModels={models.enabled}
        onToggleModel={models.onToggle}
        onToggleAll={models.onToggleAll}
      />
    ) : (
      <ProviderFormFields
        fields={fields}
        value={value}
        onChange={onFieldChange}
      />
    )}

    {connection.isError && (
      <ConnectionError
        message={connection.errorMessage}
        onRetry={() => {
          connection.onErrorReset?.();
          connection.onConnect?.(value);
        }}
      />
    )}

    {!connection.isError && (
      <ConnectButton
        onClick={() => connection.onConnect?.(value)}
        isConnected={connection.isConnected}
        isLoading={connection.isLoading}
      />
    )}
  </>
);
