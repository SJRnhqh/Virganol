// apps/ui/src/features/bot/types/provider/state/index.ts
// 导出内容

// ── Provider 卡片状态 ──
export type { ProviderCardState } from "./card";

// ── Provider 生命周期阶段 ──
export type { ProviderCheckPhase, TerminalPhase, CheckTerminalPhase } from "./phase";

// ── Provider 全局检查状态 ──
export type { ProviderCheckState } from "./check";

// ── Provider 集合状态 ──
export type { ProviderBatchUpdates, ProviderCollectionState } from "./collection";

// ── Provider 实体状态 ──
export type {
  ProviderState,
  ProviderFormData,
  ProviderModelState,
} from "./entity";
