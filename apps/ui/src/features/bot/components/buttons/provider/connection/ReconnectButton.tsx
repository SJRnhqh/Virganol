// apps/ui/src/features/bot/components/buttons/provider/ReconnectButton.tsx
// 外部依赖
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";

// 内部引用
import { retryIconVariants } from "@/lib";
import { BaseProviderButton } from "@/features/bot/components/base/provider/common";

interface ReconnectButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ReconnectButton = ({ onClick }: ReconnectButtonProps) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <BaseProviderButton
      onClick={onClick}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      <Check className="w-3.5 h-3.5 text-settings-panel-check" />
      Connected
      <motion.div
        variants={retryIconVariants}
        initial="idle"
        animate={isHovering ? "hover" : "idle"}
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </motion.div>
    </BaseProviderButton>
  );
};
