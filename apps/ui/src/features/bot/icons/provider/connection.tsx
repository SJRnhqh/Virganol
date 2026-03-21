// apps/ui/src/features/bot/icons/provider/connection.tsx
// 外部依赖
import { Play, Loader2, Check, RotateCcw } from "lucide-react";

// 内部引用
import type { ProviderCardState, DualIconButton } from "@/features/bot/types";

/** Provider 连接按钮图标映射 */
export const CONNECTION_BUTTON_ICONS: Record<
  ProviderCardState,
  DualIconButton
> = {
  unset: {
    leading: {
      icon: Play,
    },
  },
  pending: {
    leading: {
      icon: Loader2,
    },
  },
  connected: {
    leading: {
      icon: Check,
      className: "text-settings-panel-check",
    },
    trailing: {
      icon: RotateCcw,
    },
  },
  failed: {
    trailing: {
      icon: RotateCcw,
    },
  },
};
