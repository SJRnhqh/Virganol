// apps/ui/src/features/bot/components/base/provider/common/BaseProviderButton.tsx
// 外部依赖
import { motion } from "framer-motion";

// 内部引用
import { providerButtonVariants } from "@/lib";

interface BaseProviderButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

export const BaseProviderButton = ({
  children,
  onClick,
  disabled = false,
  onHoverStart,
  onHoverEnd,
}: BaseProviderButtonProps) => {
  // 按钮样式：布局 + 间距 + 圆角 + 字体
  const layoutStyles = "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium";

  // 颜色样式：默认半透明 + hover 变亮 + hover 背景
  const colorStyles = "text-settings-panel-fg/50 hover:text-settings-panel-fg/80 hover:bg-settings-panel-fg/5";

  // 状态样式：过渡动画 + disabled 样式
  const stateStyles = "transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="px-5 pb-2 pt-0 flex justify-end">
      <motion.button
        variants={providerButtonVariants}
        initial="idle"
        whileHover={!disabled ? "hover" : undefined}
        whileTap={!disabled ? "tap" : undefined}
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
        onClick={onClick}
        disabled={disabled}
        className={`${layoutStyles} ${colorStyles} ${stateStyles}`}
      >
        {children}
      </motion.button>
    </div>
  );
};
