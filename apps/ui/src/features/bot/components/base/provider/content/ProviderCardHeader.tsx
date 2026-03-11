// apps/ui/src/features/bot/components/base/provider/content/ProviderCardHeader.tsx
// 外部依赖
import { Check, Loader2, CircleAlert } from "lucide-react";
import { motion } from "framer-motion";

// 内部引用
import { PROVIDER_CARD_STATES } from "@/features/bot/constants";
import type { ProviderCardState } from "@/features/bot/types";
import { rotatingIconVariants } from "@/lib/animations";

interface ProviderCardHeaderProps {
  icon: React.ReactNode;
  name: string;
  cardState: ProviderCardState;
  open: boolean;
}

export const ProviderCardHeader = ({
  icon,
  name,
  cardState,
  open,
}: ProviderCardHeaderProps) => (
  <div className="flex items-center gap-3.5">
    <span
      className={[
        "transition-colors duration-200",
        open
          ? "text-settings-panel-fg"
          : "text-settings-panel-fg/55 group-hover:text-settings-panel-fg/80",
      ].join(" ")}
    >
      {icon}
    </span>
    <div className="flex items-center gap-2">
      <span
        className={[
          "text-sm font-medium transition-colors",
          open
            ? "text-settings-panel-fg"
            : "text-settings-panel-fg/55 group-hover:text-settings-panel-fg/80",
        ].join(" ")}
      >
        {name}
      </span>

      {/* 状态指示图标 */}
      {/* pending: 旋转的 loading 图标 */}
      {cardState === PROVIDER_CARD_STATES.PENDING && (
        <motion.div
          variants={rotatingIconVariants}
          initial="idle"
          animate="rotating"
        >
          <Loader2 className="w-4 h-4 text-settings-panel-fg/40" />
        </motion.div>
      )}
      {/* connected: 绿色对勾 */}
      {cardState === PROVIDER_CARD_STATES.CONNECTED && (
        <Check className="w-4 h-4 text-settings-panel-check" />
      )}
      {/* failed: 赭石色圆形警告图标 */}
      {cardState === PROVIDER_CARD_STATES.FAILED && (
        <CircleAlert className="w-4 h-4 text-settings-panel-error" />
      )}
    </div>
  </div>
);
