// apps/ui/src/features/bot/types/llmProviders.ts

// ============ Provider 配置类型 ============

export interface OllamaConfig {
  apiURL: string;
  apiKey: string;
}

export interface DeepseekConfig {
  apiKey: string;
}

export type ProviderId = "ollama" | "deepseek";

export interface ProviderConfigMap {
  ollama: OllamaConfig;
  deepseek: DeepseekConfig;
}

// ============ Provider 字段定义 ============

export interface ProviderField {
  key: string;
  label: string;
  type: "text" | "password";
  placeholder?: string;
  optional?: boolean;
}

export interface ProviderDefinition<T = Record<string, string>> {
  id: ProviderId;
  name: string;
  fields: ProviderField[];
  defaultConfig: T;
}

// ============ Provider 注册表 ============

export const PROVIDER_DEFINITIONS = {
  ollama: {
    id: "ollama",
    name: "Ollama",
    fields: [
      {
        key: "apiURL",
        label: "API URL",
        type: "text",
        placeholder: "http://localhost:11434",
      },
      {
        key: "apiKey",
        label: "API Key",
        type: "password",
        placeholder: "XXX...",
        optional: true,
      },
    ],
    defaultConfig: { apiURL: "http://localhost:11434", apiKey: "" },
  },
  deepseek: {
    id: "deepseek",
    name: "DeepSeek",
    fields: [
      {
        key: "apiKey",
        label: "API Key",
        type: "password",
        placeholder: "sk-xxx...",
      },
    ],
    defaultConfig: { apiKey: "" },
  },
} as const satisfies Record<ProviderId, ProviderDefinition>;

// 便捷访问默认配置
export const DEFAULT_PROVIDER_CONFIG: ProviderConfigMap = {
  ollama: PROVIDER_DEFINITIONS.ollama.defaultConfig,
  deepseek: PROVIDER_DEFINITIONS.deepseek.defaultConfig,
};

// ============ API 通讯规范 ============

// 连接请求
export interface ConnectProviderRequest extends Record<string, unknown> {
  provider_id: ProviderId;
  config: Record<string, string>;
}

// 连接响应
export interface ConnectProviderResponse {
  success: boolean;
  data?: {
    connected: boolean;
    available_models?: string[];
  };
  error?: string;
}
