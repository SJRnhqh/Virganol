// apps/ui/src/features/bot/constants/provider/definition.ts
// 内部引用
import type { ProviderId, ProviderDefinition } from "@/features/bot/types";

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
  lmstudio: {
    id: "lmstudio",
    name: "LM Studio",
    fields: [
      {
        key: "apiURL",
        label: "API URL",
        type: "text",
        placeholder: "http://localhost:1234",
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
    defaultConfig: { apiURL: "http://localhost:1234", apiKey: "" },
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
  qwen: {
    id: "qwen",
    name: "Qwen",
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
  doubao: {
    id: "doubao",
    name: "Doubao",
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
  minimax: {
    id: "minimax",
    name: "Minimax",
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
  zhipu: {
    id: "zhipu",
    name: "Zhipu",
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
  kimi: {
    id: "kimi",
    name: "Kimi",
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
  wenxin: {
    id: "wenxin",
    name: "Wenxin",
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
  hunyuan: {
    id: "hunyuan",
    name: "Hunyuan",
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
