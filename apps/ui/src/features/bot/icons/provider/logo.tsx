// apps/ui/src/features/bot/icons/provider/logo.tsx
// 外部依赖
import {
  Kimi,
  Qwen,
  Zhipu,
  Doubao,
  Ollama,
  Wenxin,
  Minimax,
  Hunyuan,
  DeepSeek,
  LmStudio,
} from "@lobehub/icons";

// 内部引用
import type { ProviderId } from "@/features/bot/types";

/** Provider 品牌 Logo 映射 */
export const PROVIDER_ICONS: Record<ProviderId, React.ReactNode> = {
  ollama: <Ollama className="w-5 h-5" />,
  lmstudio: <LmStudio className="w-5 h-5" />,
  deepseek: <DeepSeek className="w-5 h-5" />,
  qwen: <Qwen className="w-5 h-5" />,
  doubao: <Doubao className="w-5 h-5" />,
  minimax: <Minimax className="w-5 h-5" />,
  zhipu: <Zhipu className="w-5 h-5" />,
  kimi: <Kimi className="w-5 h-5" />,
  wenxin: <Wenxin className="w-5 h-5" />,
  hunyuan: <Hunyuan className="w-5 h-5" />,
}
