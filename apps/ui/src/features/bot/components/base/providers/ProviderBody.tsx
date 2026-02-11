// apps/ui/src/features/bot/components/base/providers/ProviderBody.tsx
// 内部引用
import type { ProviderField } from "@/features/bot/types/providers";
import { ProviderFormFields } from "../../forms/ProviderFormFields";
import { ProviderConnectedPanel } from "../../forms/ProviderConnectedPanel";
import { ConnectionError } from "../../forms/ConnectionError";
import { ConnectButton } from "../../buttons/Connect";

interface ProviderBodyProps {
  fields: ProviderField[];
  value: Record<string, string>;
  isConnected: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onFieldChange: (key: string, val: string) => void;
  onReset: () => void;
  onConnect?: (config: Record<string, string>) => Promise<void>;
  onErrorReset?: () => void;
  availableModels?: string[];
  enabledModels?: Record<string, boolean>;
  onModelToggle?: (model: string, enabled: boolean) => void;
  onToggleAllModels?: (enabled: boolean) => void;
}

export const ProviderBody = ({
  fields,
  value,
  isConnected,
  isLoading,
  isError,
  errorMessage,
  onFieldChange,
  onReset,
  onConnect,
  onErrorReset,
  availableModels,
  enabledModels,
  onModelToggle,
  onToggleAllModels,
}: ProviderBodyProps) => (
  <>
    <div className="w-full border-t border-dashed border-settings-panel-fg/60 mb-4" />

    {isConnected ? (
      <ProviderConnectedPanel
        fields={fields}
        value={value}
        onReset={onReset}
        models={availableModels}
        enabledModels={enabledModels}
        onToggleModel={onModelToggle}
        onToggleAll={onToggleAllModels}
      />
    ) : (
      <ProviderFormFields
        fields={fields}
        value={value}
        onChange={onFieldChange}
      />
    )}

    {isError && (
      <ConnectionError
        message={errorMessage}
        onRetry={() => {
          onErrorReset?.();
          onConnect?.(value);
        }}
      />
    )}

    {!isError && (
      <ConnectButton
        onClick={() => onConnect?.(value)}
        isConnected={isConnected}
        isLoading={isLoading}
      />
    )}
  </>
);

