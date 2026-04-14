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
  };
  failed: {
    primaryAction?: ProviderButtonAction;
  };
};

/**
 * ProviderCardActions 按状态划分的 Props 映射：
 * - 所有状态：主按钮（Connect/Reconnect/Retry）
 * - Reset 按钮已移至各自的 content 区域（ConnectedPanel/ErrorPanel）
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
