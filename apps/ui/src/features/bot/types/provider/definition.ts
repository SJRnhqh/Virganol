// apps/ui/src/features/bot/types/provider/definition.ts
// 内部引用
import type { ProviderId } from "./common";

export interface ProviderField {
  key: string;
  label: string;
  type: "text" | "password";
  placeholder?: string;
  optional?: boolean;
  isUrl?: boolean;
}

export interface ProviderDefinition<T = Record<string, string>> {
  id: ProviderId;
  name: string;
  fields: ProviderField[];
  defaultConfig: T;
}
