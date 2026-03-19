// apps/ui/src/features/bot/constants/provider/connection/animations.ts
// 外部依赖
import { connectIconVariants, rotatingIconVariants } from "@/lib";

// 内部引用
import type { ProviderCardState, ButtonAnimation } from "@/features/bot/types";

/** Provider 连接按钮动画映射 */
export const CONNECTION_BUTTON_ANIMATIONS: Record<
  ProviderCardState,
  ButtonAnimation
> = {
  unset: {
    variant: connectIconVariants,
    trigger: "hover",
  },
  pending: {
    variant: rotatingIconVariants,
    trigger: "always",
  },
  connected: {
    trigger: "none",
  },
  failed: {
    trigger: "none",
  },
};
