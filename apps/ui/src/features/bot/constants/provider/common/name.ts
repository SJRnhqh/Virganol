// apps/ui/src/features/bot/constants/provider/common/name.ts
// 内部引用
import type { ProviderId } from "@/features/bot/types";

/** Provider 显示名称映射 */
export const PROVIDER_NAMES: Record<ProviderId, string> = {
  ollama: "Ollama",
  lmstudio: "LM Studio",
  deepseek: "DeepSeek",
  qwen: "Qwen",
  doubao: "Doubao",
  minimax: "Minimax",
  zhipu: "Zhipu",
  kimi: "Kimi",
  wenxin: "Wenxin",
  hunyuan: "Hunyuan",
};
