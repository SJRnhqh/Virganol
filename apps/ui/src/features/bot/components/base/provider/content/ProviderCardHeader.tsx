// apps/ui/src/features/bot/components/base/provider/content/ProviderCardHeader.tsx
// 外部依赖
import { motion } from "framer-motion";

// 内部引用
import { cn, rotatingIconVariants } from "@/lib";
import type {
  ProviderCardState,
  ProviderCardHeaderProps,
} from "@/features/bot/types";
import { PROVIDER_CARD_STATES } from "@/features/bot/constants";
import { PROVIDER_CARD_STATE_ICONS } from "@/features/bot/icons";

const CARD_STATE_ICON_CLASS_NAMES: Partial<Record<ProviderCardState, string>> =
  {
    pending: "w-4 h-4 text-settings-panel-fg/40",
    connected: "w-4 h-4 text-settings-panel-check",
    failed: "w-4 h-4 text-settings-panel-error",
  };

export const ProviderCardHeader = ({
  meta,
  cardState,
  open,
}: ProviderCardHeaderProps) => {
  const CardStateIcon = PROVIDER_CARD_STATE_ICONS[cardState];
  const cardStateIconClassName = CARD_STATE_ICON_CLASS_NAMES[cardState];
  const metaToneClassName = open
    ? "text-settings-panel-fg"
    : "text-settings-panel-fg/55 group-hover:text-settings-panel-fg/80";

  return (
    <div className="flex items-center gap-3.5">
      <span className={cn("transition-colors duration-200", metaToneClassName)}>
        {meta.icon}
      </span>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-sm font-medium transition-colors",
            metaToneClassName,
          )}
        >
          {meta.name}
        </span>

        {CardStateIcon && cardState === PROVIDER_CARD_STATES.PENDING && (
          <motion.div
            variants={rotatingIconVariants}
            initial="idle"
            animate="rotating"
          >
            <CardStateIcon className={cardStateIconClassName} />
          </motion.div>
        )}
        {CardStateIcon && cardState !== PROVIDER_CARD_STATES.PENDING && (
          <CardStateIcon className={cardStateIconClassName} />
        )}
      </div>
    </div>
  );
};
