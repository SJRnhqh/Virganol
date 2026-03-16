// apps/ui/src/features/bot/constants/provider/config/fields.ts
// 内部引用
import type { ProviderId, ProviderFormField } from "@/features/bot/types";

/** Provider 表单字段配置（用于动态渲染表单输入控件） */
export const PROVIDER_FORM_FIELDS: Record<ProviderId, ProviderFormField[]> = {
  ollama: [
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
  lmstudio: [
    {
      key: "apiURL",
      label: "API URL",
      type: "text",
      placeholder: "http://localhost:1234",
    },
    {
      key: "apiKey",
      label: "API Key",
      type: "password",
      placeholder: "XXX...",
      optional: true,
    },
  ],
  deepseek: [
    {
      key: "apiKey",
      label: "API Key",
      type: "password",
      placeholder: "sk-xxx...",
    },
  ],
  qwen: [
    {
      key: "apiKey",
      label: "API Key",
      type: "password",
      placeholder: "sk-xxx...",
    },
  ],
  doubao: [
    {
      key: "apiKey",
      label: "API Key",
      type: "password",
      placeholder: "sk-xxx...",
    },
  ],
  minimax: [
    {
      key: "apiKey",
      label: "API Key",
      type: "password",
      placeholder: "sk-xxx...",
    },
  ],
  zhipu: [
    {
      key: "apiKey",
      label: "API Key",
      type: "password",
      placeholder: "sk-xxx...",
    },
  ],
  kimi: [
    {
      key: "apiKey",
      label: "API Key",
      type: "password",
      placeholder: "sk-xxx...",
    },
  ],
  wenxin: [
    {
      key: "apiKey",
      label: "API Key",
      type: "password",
      placeholder: "sk-xxx...",
    },
  ],
  hunyuan: [
    {
      key: "apiKey",
      label: "API Key",
      type: "password",
      placeholder: "sk-xxx...",
    },
  ],
};
