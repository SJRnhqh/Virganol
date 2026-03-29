// apps/ui/src/features/bot/types/provider/common/id.ts
// 完整 provider 枚举；运行时激活集合由 constants/PROVIDER_IDS 另行控制，当前仅激活 ollama / deepseek。
export type ProviderId =
  | "ollama"
  | "lmstudio"
  | "deepseek"
  | "qwen"
  | "doubao"
  | "minimax"
  | "zhipu"
  | "kimi"
  | "wenxin"
  | "hunyuan";
