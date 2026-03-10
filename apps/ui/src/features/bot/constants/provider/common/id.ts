// apps/ui/src/features/bot/constants/provider/common/id.ts
// 内部引用
import type { ProviderId } from "@/features/bot/types";

/** Provider ID 列表（前端支持的 Provider 标识符） */
export const PROVIDER_IDS = [
  "ollama",
  "lmstudio",
  "deepseek",
  "qwen",
  "doubao",
  "minimax",
  "zhipu",
  "kimi",
  "wenxin",
  "hunyuan",
] as const satisfies readonly ProviderId[];
