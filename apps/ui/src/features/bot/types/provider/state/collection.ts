// apps/ui/src/features/bot/types/provider/state/collection.ts
// 内部引用
import type { ProviderId } from "../common";
import type {
  ProviderState,
  ProviderFormData,
  ProviderModelState,
} from "./entity";
import type { ProviderCardState } from "./card";

/** 批量更新的字段集合（所有字段可选） */
export interface ProviderBatchUpdates {
  /** 卡片状态 */
  cardState?: ProviderCardState;
  /** 表单字段补丁 */
  form?: Partial<ProviderFormData>;
  /** 模型状态 */
  models?: ProviderModelState;
  /**
   * 错误信息，三值语义：
   * - `undefined`（字段缺失）：不更新，store 保留原值
   * - `null`：清空错误信息
   * - `string`：写入新错误信息
   *
   * 调用方须遵守此约定；单独的 `setProviderError` / `clearProviderError`
   * 在只需操作错误字段时可替代批量更新，语义更显式。
   *
   * 此字段可在未来替换为结构化错误体（如 `{ code: string; message: string }`），
   * 三值语义与 store 实现均无需改动，仅替换类型 `T` 即可。
   */
  errorMessage?: string | null;
  /** connect 操作锁状态 */
  isPending?: boolean;
}

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
    patch: Partial<ProviderFormData>,
  ) => void;
  /** 覆盖更新单个 Provider 的模型状态。 */
  setProviderModels: (
    /** 目标 Provider 标识。 */
    providerId: ProviderId,
    /** 要写入的模型状态快照。 */
    models: ProviderModelState,
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
  /** 设置单个 Provider 的 pending 状态（connect 操作锁）。 */
  setProviderPending: (
    /** 目标 Provider 标识。 */
    providerId: ProviderId,
    /** 是否处于 pending 状态。 */
    isPending: boolean,
  ) => void;
  /** 批量更新单个 Provider 的多个字段（减少重渲染）。 */
  updateProviderBatch: (
    /** 目标 Provider 标识。 */
    providerId: ProviderId,
    /** 待更新的字段集合。 */
    updates: ProviderBatchUpdates,
  ) => void;
}
