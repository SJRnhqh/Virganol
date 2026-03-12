// apps/ui/src/features/bot/icons/provider/card.tsx
// 外部依赖
import { Check, Loader2, CircleAlert } from "lucide-react";

// 内部引用
import type { ProviderCardState } from "@/features/bot/types";

type ProviderCardIcon = React.ComponentType<{ className?: string }> | null;

/** Provider 卡片状态对应的图标映射 */
export const PROVIDER_CARD_STATE_ICONS: Record<
  ProviderCardState,
  ProviderCardIcon
> = {
  unset: null,
  pending: Loader2,
  connected: Check,
  failed: CircleAlert,
};
