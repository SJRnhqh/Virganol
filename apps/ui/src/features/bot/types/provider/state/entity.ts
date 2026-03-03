// apps/ui/src/features/bot/types/provider/state/entity.ts
// 内部引用
import type { ProviderCardState } from "@/features/bot/constants";

// ── Provider Entity Fields（单个 Provider 子结构）───

interface ProviderFormData {
  /** Provider 接口地址（如本地/远程 API URL）。 */
  apiURL?: string;
  /** Provider 密钥输入（仅前端表单态，非持久化语义）。 */
  apiKey?: string;
}

interface ProviderModelState {
  /** 后端返回的当前可用模型列表。 */
  available: string[];
  /** 模型启用开关映射（key 为模型名，value 为是否启用）。 */
  enabled: Record<string, boolean>;
}

// ── Provider State（单个 Provider 完整状态）───

export interface ProviderState {
  /** 单个 Provider 卡片主状态（unset/pending/connected/failed）。 */
  cardState: ProviderCardState;
  /** 单个 Provider 的表单输入状态。 */
  form: ProviderFormData;
  /** 单个 Provider 的模型状态。 */
  models: ProviderModelState;
  /** 单个 Provider 的错误信息（无错误时为 null）。 */
  errorMessage: string | null;
}
