import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { connectButtonVariants, connectIconVariants } from "@/lib/animations";

interface ConnectButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ConnectButton = ({ onClick }: ConnectButtonProps) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="px-5 pb-2 pt-0 flex justify-end">
      <motion.button
        variants={connectButtonVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        onClick={onClick}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium"
      >
        <motion.div
          variants={connectIconVariants}
          initial="idle"
          animate={isHovering ? "hover" : "idle"}
        >
          <Play className="w-3.5 h-3.5" />
        </motion.div>
        Connect
      </motion.button>
    </div>
  );
};
