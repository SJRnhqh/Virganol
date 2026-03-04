// apps/ui/src/features/bot/components/buttons/provider/ConnectingButton.tsx
// 外部依赖
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

// 内部引用
import { rotatingIconVariants } from "@/lib";
import { BaseProviderButton } from "@/features/bot/components/base/provider/common";

export const ConnectingButton = () => {
  return (
    <BaseProviderButton disabled>
      <motion.div
        variants={rotatingIconVariants}
        initial="idle"
        animate="rotating"
      >
        <Loader2 className="w-3.5 h-3.5" />
      </motion.div>
      Connecting
    </BaseProviderButton>
  );
};
