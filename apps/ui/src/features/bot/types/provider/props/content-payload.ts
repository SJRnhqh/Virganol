// apps/ui/src/features/bot/types/provider/props/content-payload.ts
// 内部引用
import type { ProviderField } from "../definition";
import type { ProviderFormData } from "../state";

// TODO: 当前先完成 Body 内容层的内容接口拆分；各字段仍需后续按 editable / failed / connected 分支继续审查并收紧。

export interface ProviderEditableContent {
  fields: ProviderField[];
  formData: ProviderFormData;
  onChange: (key: keyof ProviderFormData, value: string) => void;
}

export interface ProviderFailedContent {
  errorMessage?: string | null;
}

export interface ProviderConnectedContent {
  fields: ProviderField[];
  value: ProviderFormData;
  models?: string[];
  enabledModels?: Record<string, boolean>;
  onToggleModel?: (model: string, enabled: boolean) => void;
  onToggleAll?: (enabled: boolean) => void;
  onReset?: () => void;
}
