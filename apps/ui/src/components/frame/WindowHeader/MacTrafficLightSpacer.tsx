// apps/ui/src/components/frame/WindowHeader/MacTrafficLightSpacer.tsx
import { motion } from "framer-motion";

interface Props {
  isFullscreen: boolean;
}

export function MacTrafficLightSpacer({ isFullscreen }: Props) {
  return (
    <motion.div
      initial={false}
      animate={{ width: isFullscreen ? 0 : 60 }}
      style={{ willChange: "width" }}
      transition={{
        width: isFullscreen
          ? {
              // -> 进全屏 (油压滑轨感)
              type: "spring",
              stiffness: 80,
              damping: 25,
              mass: 2.0,
              restDelta: 0.01,
            }
          : {
              // <- 回窗口 (快速响应)
              type: "spring",
              stiffness: 280,
              damping: 35,
              mass: 0.8,
            },
      }}
      className="h-full shrink-0"
    />
  );
}
