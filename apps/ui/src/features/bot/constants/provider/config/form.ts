// apps/ui/src/features/bot/constants/provider/config/form.ts
// 内部引用
import type { ProviderId, ProviderFormData } from "@/features/bot/types";

/** Provider 表单字段初始值（用于 store 初始化） */
export const PROVIDER_INITIAL_FORMS: Record<ProviderId, ProviderFormData> = {
  ollama: { apiURL: "http://localhost:11434", apiKey: "" },
  lmstudio: { apiURL: "http://localhost:1234", apiKey: "" },
  deepseek: { apiKey: "" },
  qwen: { apiKey: "" },
  doubao: { apiKey: "" },
  minimax: { apiKey: "" },
  zhipu: { apiKey: "" },
  kimi: { apiKey: "" },
  wenxin: { apiKey: "" },
  hunyuan: { apiKey: "" },
};
