import { motion, AnimatePresence } from "framer-motion";
import { Minus, Maximize2, Minimize2, X } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";

interface Props {
  isMaximized: boolean;
}

export function WindowsWindowControls({ isMaximized }: Props) {
  const appWindow = getCurrentWindow();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute right-0 top-0 h-full flex items-center pr-2"
        onMouseDown={(e) => e.stopPropagation()} // 防止拖拽
      >
        <button onClick={() => appWindow.minimize()} className="group h-8 w-10 flex items-center justify-center rounded-md text-header-icon-muted hover:bg-window-control-minimize hover:text-header-icon transition-all duration-200">
          <Minus strokeWidth={3} size={14} />
        </button>

        <button onClick={() => appWindow.toggleMaximize()} className="group h-8 w-10 flex items-center justify-center rounded-md text-header-icon-muted hover:bg-window-control-toggle-maximize hover:text-header-icon transition-all duration-200">
          {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
        </button>

        <button
          onClick={() => appWindow.close()}
          className="group h-8 w-10 flex items-center justify-center rounded-md text-header-icon-muted hover:bg-window-control-close hover:text-header-icon transition-all duration-200"
        >
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
