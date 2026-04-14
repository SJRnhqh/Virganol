// apps/ui/src/features/bot/components/settings/provider/content/cards/ProviderCardActions.tsx
// 内部引用
import type { ProviderCardActionsProps } from "@/features/bot/types";
import { ProviderConnectionButton } from "./ProviderConnectionButton";

export const ProviderCardActions = ({
  cardState,
  actions,
}: ProviderCardActionsProps) => {
  // 所有状态统一渲染：
  // - UNSET/PENDING: Connect 按钮
  // - CONNECTED: Reconnect 按钮
  // - FAILED: Retry 按钮
  // Reset 按钮已移至各自的 content 区域（ConnectedPanel/ErrorPanel）
  return (
    <div className="px-5 pb-2 pt-0 flex justify-end">
      <ProviderConnectionButton
        cardState={cardState}
        onClick={actions.primaryAction}
      />
    </div>
  );
};
