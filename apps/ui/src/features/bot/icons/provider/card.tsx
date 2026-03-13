// apps/ui/src/features/bot/icons/provider/card.tsx
// 外部依赖
import { Check, Loader2, CircleAlert } from "lucide-react";

// 内部引用
import type { IconSlot, ProviderCardState } from "@/features/bot/types";

/** Provider 卡片状态对应的图标映射 */
export const PROVIDER_CARD_STATE_ICONS: Record<
  ProviderCardState,
  IconSlot | null
> = {
  unset: null,
  pending: {
    icon: Loader2,
    className: "text-settings-panel-fg/40",
  },
  connected: {
    icon: Check,
    className: "text-settings-panel-check",
  },
  failed: {
    icon: CircleAlert,
    className: "text-settings-panel-error",
  },
};
