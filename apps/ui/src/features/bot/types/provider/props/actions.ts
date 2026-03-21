// apps/ui/src/features/bot/types/provider/props/actions.ts
// 内部引用
import type { ProviderCardState } from "../state";
import type { ProviderButtonAction } from "./button";

type ProviderCardActionsMap = {
  unset: {
    primaryAction?: ProviderButtonAction;
  };
  pending: {
    primaryAction?: ProviderButtonAction;
  };
  connected: {
    primaryAction?: ProviderButtonAction;
    resetAction: ProviderButtonAction;
  };
  failed: {
    primaryAction?: ProviderButtonAction;
    resetAction: ProviderButtonAction;
  };
};

/**
 * ProviderCardActions 按状态划分的 Props 映射：
 * - unset/pending → 主按钮
 * - connected/failed → Reset + 主按钮
 */
export type ProviderCardActionsPropsByState = {
  [State in ProviderCardState]: {
    cardState: State;
    actions: ProviderCardActionsMap[State];
  };
};

/**
 * ProviderCardActions 组件 Props：基于 cardState 自动推断 actions 类型
 */
export type ProviderCardActionsProps =
  ProviderCardActionsPropsByState[ProviderCardState];
