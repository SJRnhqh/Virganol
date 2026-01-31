// apps/ui/src/features/bot/types/llmProviders.ts

export interface OllamaConfig {
  apiURL: string;
  apiKey: string;
}

export interface DeepseekConfig {
  apiKey: string;
}

export type ProviderId = "ollama" | "deepseek";

// 统一的配置映射类型
export interface ProviderConfigMap {
  ollama: OllamaConfig;
  deepseek: DeepseekConfig;
}

// 集中默认值，便于复用与重置
export const DEFAULT_PROVIDER_CONFIG: ProviderConfigMap = {
  ollama: {
    apiURL: "http://localhost:11434",
    apiKey: "",
  },
  deepseek: {
    apiKey: "",
  },
};
