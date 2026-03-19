// apps/ui/src/features/bot/constants/provider/common/id.ts
// 内部引用
import type { ProviderId } from "@/features/bot/types";

/** Provider ID 列表（前端支持的 Provider 标识符） */
export const PROVIDER_IDS = [
  "ollama",
  "deepseek",
  // 当前阶段运行时仅启用 deepseek / ollama。
  // 其余 provider 先保留定义，待桌面层 lifecycle / CRUD 真正支持后再逐步放开。
  // "lmstudio",
  // "qwen",
  // "doubao",
  // "minimax",
  // "zhipu",
  // "kimi",
  // "wenxin",
  // "hunyuan",
] as const satisfies readonly ProviderId[];
