// apps/ui/src/features/bot/types/provider/state/collection.ts
// 内部引用
import type { ProviderId } from "@/features/bot/types/provider/common";
import type { ProviderCardState } from "@/features/bot/constants";
import type { ProviderState } from "./entity";

// ── Provider Collection（薄聚合：仅路由映射）───

export interface ProviderCollectionState {
  /** 以 ProviderId 为键的单个 Provider 状态集合。 */
  byId: Record<ProviderId, ProviderState>;
  /** 更新单个 Provider 的卡片主状态。 */
  setProviderCardState: (
    /** 目标 Provider 标识。 */
    providerId: ProviderId,
    /** 要写入的新卡片状态。 */
    cardState: ProviderCardState,
  ) => void;
  /** 合并更新单个 Provider 的表单字段。 */
  setProviderForm: (
    /** 目标 Provider 标识。 */
    providerId: ProviderId,
    /** 待合并的表单字段补丁。 */
    patch: Partial<ProviderState["form"]>,
  ) => void;
  /** 覆盖更新单个 Provider 的模型状态。 */
  setProviderModels: (
    /** 目标 Provider 标识。 */
    providerId: ProviderId,
    /** 要写入的模型状态快照。 */
    models: ProviderState["models"],
  ) => void;
  /** 更新单个 Provider 的单个模型启用状态。 */
  setModelEnabled: (
    /** 目标 Provider 标识。 */
    providerId: ProviderId,
    /** 目标模型名称。 */
    model: string,
    /** 是否启用。 */
    enabled: boolean,
  ) => void;
  /** 更新单个 Provider 的所有模型启用状态。 */
  setAllModelsEnabled: (
    /** 目标 Provider 标识。 */
    providerId: ProviderId,
    /** 是否启用。 */
    enabled: boolean,
  ) => void;
  /** 设置单个 Provider 的错误信息。 */
  setProviderError: (
    /** 目标 Provider 标识。 */
    providerId: ProviderId,
    /** 要写入的错误文案。 */
    message: string,
  ) => void;
  /** 清空单个 Provider 的错误信息。 */
  clearProviderError: (
    /** 目标 Provider 标识。 */
    providerId: ProviderId,
  ) => void;
}
