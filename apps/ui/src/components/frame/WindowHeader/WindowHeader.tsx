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
      // bg-header-bg 映射到 Sage，border-sidebar-border 映射到 Paper Edge
      className={`relative h-10 flex items-center border-b border-sidebar-border bg-header-bg shrink-0 select-none cursor-default
        ${isMac ? "pl-18.75 pr-4" : "px-4 sm:px-6"}
      `}
      onMouseDown={(e) =>
        e.button === 0 && e.detail === 1 && getCurrentWindow().startDragging()
      }
      onDoubleClick={() => getCurrentWindow().toggleMaximize()}
    >
      <Breadcrumb label={currentItem?.label} />

      {/* 设置按钮区域：间距适配 Windows 系统按钮 */}
      <div
        className={`flex items-center h-full ml-auto ${isWindows ? "mr-24" : "mr-1"}`}
      >
        <SettingsButton onClick={() => console.log("Open Settings")} />
      </div>

      {/* 🪟 Windows 控制按钮：全面语义化重构 */}
      {isWindows && (
        <div
          className="absolute right-0 top-0 h-full flex items-center pr-2"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* 最小化按钮 */}
          <button
            onClick={() => getCurrentWindow().minimize()}
            // 1. text-header-icon-muted: 使用米色透明度代替深炭灰，增加温润感
            // 2. hover:bg-parchment-fade: 使用米色光晕代替白色透明
            className="group h-8 w-10 flex items-center justify-center rounded-md
                       text-header-icon-muted hover:bg-parchment-fade hover:text-header-icon
                       transition-all duration-200"
            title="Minimize"
          >
            <Minus strokeWidth={3} size={14} />
          </button>

          {/* 最大化/还原按钮 */}
          <button
            onClick={() => getCurrentWindow().toggleMaximize()}
            className="group h-8 w-10 flex items-center justify-center rounded-md
                       text-header-icon-muted hover:bg-parchment-fade hover:text-header-icon
                       transition-all duration-200"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>

          {/* 关闭按钮 */}
          <button
            onClick={() => getCurrentWindow().close()}
            // 关闭按钮在 Hover 时使用调色板中的 rose 色，文字变为纯净的米色
            className="group h-8 w-10 flex items-center justify-center rounded-md
                       text-header-icon-muted hover:bg-rose hover:text-parchment
                       transition-all duration-200"
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </header>
  );
}
