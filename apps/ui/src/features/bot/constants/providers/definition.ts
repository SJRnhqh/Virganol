// apps/ui/src/features/bot/constants/providers/definition.ts
// 内部引用
import type {
  ProviderDefinition,
  ProviderId,
} from "@/features/bot/types/providers";

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
        isUrl: true,
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
