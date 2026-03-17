// apps/ui/src/features/bot/types/provider/props/models.ts
/**
 * Provider 模型管理片段：包含模型数据与操作。
 * 后端保证：available_models 是实时拉取，enabled_models 已经过协调（只包含 available 中存在的模型）。
 */
export interface WithProviderModels {
  /** 可用模型列表（后端实时拉取） */
  available: string[];
  /** 启用状态映射（后端保证是 available 的子集） */
  enabled: Record<string, boolean>;
  /** 切换单个模型启用状态 */
  onToggle: (model: string, enabled: boolean) => void;
  /** 切换全部模型启用状态 */
  onToggleAll: (enabled: boolean) => void;
}
