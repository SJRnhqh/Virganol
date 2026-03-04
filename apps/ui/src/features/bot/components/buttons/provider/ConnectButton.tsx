// apps/ui/src/features/bot/components/buttons/provider/ConnectButton.tsx
// 外部依赖
import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

// 内部引用
import { connectIconVariants } from "@/lib";
import { BaseProviderButton } from "@/features/bot/components/base/provider/common";

interface ConnectButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ConnectButton = ({ onClick }: ConnectButtonProps) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <BaseProviderButton
      onClick={onClick}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      <motion.div
        variants={connectIconVariants}
        initial="idle"
        animate={isHovering ? "hover" : "idle"}
      >
        <Play className="w-3.5 h-3.5" />
      </motion.div>
      Connect
    </BaseProviderButton>
  );
};
