import { useMemo, useState, useEffect } from "react";
import { Minus, Maximize2, Minimize2, X } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { type } from "@tauri-apps/plugin-os";
import { NAV_ITEMS } from "@/config/navigation";

import { Breadcrumb } from "./Breadcrumb";
import { SettingsButton } from "./SettingsButton";

interface WindowHeaderProps {
  activeId: string;
}

export function WindowHeader({ activeId }: WindowHeaderProps) {
  const [osType] = useState(() => type());
  const isWindows = osType === "windows";
  const isMac = osType === "macos";
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const appWindow = getCurrentWindow();
    appWindow.isMaximized().then(setIsMaximized);
    const updateState = () => appWindow.isMaximized().then(setIsMaximized);
    window.addEventListener("resize", updateState);
    return () => window.removeEventListener("resize", updateState);
  }, []);

  const currentItem = useMemo(
    () => NAV_ITEMS.find((item) => item.id === activeId),
    [activeId],
  );

  return (
    <header
      // 使用语义化的 header-bg 和 sidebar-border
      className={`relative h-10 flex items-center border-b border-sidebar-border bg-header-bg shrink-0 select-none cursor-default
        ${isMac ? "pl-18.75 pr-4" : "px-4 sm:px-6"}
      `}
      onMouseDown={(e) =>
        e.button === 0 && e.detail === 1 && getCurrentWindow().startDragging()
      }
      onDoubleClick={() => getCurrentWindow().toggleMaximize()}
    >
      <Breadcrumb label={currentItem?.label} />

      {/* 设置按钮间距适配 Windows 红绿灯 */}
      <div
        className={`flex items-center h-full ml-auto ${isWindows ? "mr-20" : "mr-1"}`}
      >
        <SettingsButton onClick={() => console.log("Open Settings")} />
      </div>

      {isWindows && (
        <div
          className="absolute right-0 top-0 h-full flex items-center pr-2"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => getCurrentWindow().minimize()}
            className="group h-8 w-10 flex items-center justify-center rounded-md text-header-fg/40 hover:bg-white/10 hover:text-header-fg transition-all"
          >
            <Minus strokeWidth={3} size={14} />
          </button>
          <button
            onClick={() => getCurrentWindow().toggleMaximize()}
            className="group h-8 w-10 flex items-center justify-center rounded-md text-header-fg/40 hover:bg-white/10 hover:text-header-fg transition-all"
          >
            {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
          {/* 只有关闭按钮使用调色板中的 rose 强调色 */}
          <button
            onClick={() => getCurrentWindow().close()}
            className="group h-8 w-10 flex items-center justify-center rounded-md text-header-fg/40 hover:bg-rose hover:text-white transition-all"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </header>
  );
}
