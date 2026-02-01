import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Check, RotateCcw, Loader2 } from "lucide-react";
import {
  connectButtonVariants,
  connectIconVariants,
  rotatingIconVariants,
} from "@/lib/animations";

interface ConnectButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isConnected?: boolean;
  isLoading?: boolean;
}

export const ConnectButton = ({
  onClick,
  isConnected = false,
  isLoading = false,
}: ConnectButtonProps) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="px-5 pb-2 pt-0 flex justify-end">
      <motion.button
        variants={connectButtonVariants}
        initial="idle"
        whileHover={!isLoading ? "hover" : "idle"}
        whileTap={!isLoading ? "tap" : "idle"}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        onClick={onClick}
        disabled={isLoading}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-settings-panel-fg/50 hover:text-settings-panel-fg/80 hover:bg-settings-panel-fg/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <motion.div
              variants={rotatingIconVariants}
              initial="idle"
              animate="rotating"
            >
              <Loader2 className="w-3.5 h-3.5" />
            </motion.div>
            Connecting
          </>
        ) : isConnected ? (
          <>
            <Check className="w-3.5 h-3.5 text-settings-panel-check" />
            Connected
            <RotateCcw className="w-3.5 h-3.5" />
          </>
        ) : (
          <>
            <motion.div
              variants={connectIconVariants}
              initial="idle"
              animate={isHovering && !isConnected ? "hover" : "idle"}
            >
              <Play className="w-3.5 h-3.5" />
            </motion.div>
            Connect
          </>
        )}
      </motion.button>
    </div>
  );
};
