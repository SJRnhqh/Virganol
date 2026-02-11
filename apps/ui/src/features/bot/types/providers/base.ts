// apps/ui/src/features/bot/types/providers/base.ts

/** 连接状态 + 连接操作 */
export interface ProviderConnectionProps {
  isConnected: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onConnect?: (config: Record<string, string>) => Promise<void>;
  onDisconnect?: () => void;
  onErrorReset?: () => void;
}

/** 模型数据 + 模型操作 */
export interface ProviderModelProps {
  available?: string[];
  enabled?: Record<string, boolean>;
  onToggle?: (model: string, enabled: boolean) => void;
  onToggleAll?: (enabled: boolean) => void;
}

