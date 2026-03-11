// apps/ui/src/features/bot/types/provider/base.ts
// 内部引用
import type { ProviderCardState, ProviderFormData } from "./state";

/** 连接状态 + 连接操作 */
export interface ProviderConnectionProps {
  cardState: ProviderCardState;
  errorMessage: string | null;
  onConnect?: (formData: ProviderFormData) => Promise<void>;
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
