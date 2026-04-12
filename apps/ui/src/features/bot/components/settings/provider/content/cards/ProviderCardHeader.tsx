// apps/ui/src/features/bot/components/settings/provider/content/cards/ProviderCardHeader.tsx
// 外部依赖
import { motion } from "framer-motion";

// 内部引用
import { cn, rotatingIconVariants } from "@/lib";
import type { ProviderCardHeaderProps } from "@/features/bot/types";
import { PROVIDER_CARD_STATES } from "@/features/bot/constants";
import { PROVIDER_CARD_STATE_ICONS } from "@/features/bot/icons";

export const ProviderCardHeader = ({
  cardState,
  provider,
  open,
}: ProviderCardHeaderProps) => {
  const cardStateIconSlot = PROVIDER_CARD_STATE_ICONS[cardState];
  const CardStateIcon = cardStateIconSlot?.icon;
  const providerToneClassName = open
    ? "text-settings-panel-fg"
    : "text-settings-panel-fg/55 group-hover:text-settings-panel-fg/80";

  return (
    <div className="flex items-center gap-3.5">
      <span
        className={cn("transition-colors duration-200", providerToneClassName)}
      >
        {provider.icon}
      </span>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-sm font-medium transition-colors",
            providerToneClassName,
          )}
        >
          {provider.name}
        </span>

        {CardStateIcon &&
          (cardState === PROVIDER_CARD_STATES.PENDING ? (
            <motion.div
              variants={rotatingIconVariants}
              initial="idle"
              animate="rotating"
            >
              <CardStateIcon
                className={cn("w-4 h-4", cardStateIconSlot.className)}
              />
            </motion.div>
          ) : (
            <CardStateIcon
              className={cn("w-4 h-4", cardStateIconSlot.className)}
            />
          ))}
      </div>
    </div>
  );
};
