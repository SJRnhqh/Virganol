// apps/ui/src/components/header/WindowsWindowControls.tsx
import { getCurrentWindow } from "@tauri-apps/api/window";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, Minimize2, Minus, X } from "lucide-react";

interface Props {
  isMaximized: boolean;
}

export function WindowsWindowControls({ isMaximized }: Props) {
  const appWindow = getCurrentWindow();
  const baseBtnClass =
    "group h-8 w-10 flex items-center justify-center rounded-md text-header-icon-muted hover:text-header-icon transition-all duration-200";

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1 }}
        className="absolute right-0 top-0 h-full flex items-center pr-2"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        onMouseDown={(e) => e.stopPropagation()} // 防止拖拽
      >
        <button
          className={`${baseBtnClass} hover:bg-window-control-minimize`}
          onClick={() => appWindow.minimize()}
        >
          <Minus size={14} strokeWidth={3} />
        </button>

        <button
          className={`${baseBtnClass} hover:bg-window-control-toggle-maximize`}
          onClick={() => appWindow.toggleMaximize()}
        >
          {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
        </button>

        <button
          className={`${baseBtnClass} hover:bg-window-control-close`}
          onClick={() => appWindow.close()}
        >
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
