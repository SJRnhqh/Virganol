// apps/ui/src/features/bot/components/buttons/provider/ProviderConnectionButton.tsx
// 外部依赖
import { motion } from "framer-motion";
import { useState } from "react";

// 内部引用
import { cn, providerButtonVariants } from "@/lib";
import type { ProviderConnectionButtonProps } from "@/features/bot/types";
import {
  PROVIDER_CARD_STATES,
  CONNECTION_STATE_LABELS,
  CONNECTION_BUTTON_ANIMATIONS,
} from "@/features/bot/constants";
import { CONNECTION_BUTTON_ICONS } from "@/features/bot/icons";

export const ProviderConnectionButton = ({
  cardState,
  onClick,
}: ProviderConnectionButtonProps) => {
  const [isHovering, setIsHovering] = useState(false);

  // 从配置中获取图标、文本、动画
  const icons = CONNECTION_BUTTON_ICONS[cardState];
  const label = CONNECTION_STATE_LABELS[cardState];
  const animation = CONNECTION_BUTTON_ANIMATIONS[cardState];

  // 判断是否应该播放动画
  const shouldAnimate =
    animation.trigger === "always" ||
    (animation.trigger === "hover" && isHovering);

  // pending 状态禁用按钮
  const disabled = cardState === PROVIDER_CARD_STATES.PENDING;

  return (
    <div className="px-5 pb-2 pt-0 flex justify-end">
      <motion.button
        variants={providerButtonVariants}
        initial="idle"
        whileHover={!disabled ? "hover" : undefined}
        whileTap={!disabled ? "tap" : undefined}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        onClick={() => {
          void onClick?.();
        }}
        disabled={disabled}
        className={cn(
          // 布局
          "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
          // 颜色
          "text-settings-panel-fg/50 hover:text-settings-panel-fg/80 hover:bg-settings-panel-fg/5",
          // 状态
          "transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        )}
      >
        {/* 前置图标 */}
        {icons.leading && (
          <motion.div
            variants={animation.variant}
            initial="idle"
            animate={shouldAnimate ? "hover" : "idle"}
          >
            <icons.leading.icon
              className={cn("w-3.5 h-3.5", icons.leading.className)}
            />
          </motion.div>
        )}

        {/* 文本标签 */}
        {label}

        {/* 后置图标 */}
        {icons.trailing && (
          <motion.div
            variants={animation.variant}
            initial="idle"
            animate={shouldAnimate ? "hover" : "idle"}
          >
            <icons.trailing.icon
              className={cn("w-3.5 h-3.5", icons.trailing.className)}
            />
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};
