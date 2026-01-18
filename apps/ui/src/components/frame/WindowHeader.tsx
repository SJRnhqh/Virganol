import { memo, useState, useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { type as getOsType } from "@tauri-apps/plugin-os";
import { Minus, Square, X, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WindowControlBtnProps {
  children: React.ReactNode;
  onClick: () => void;
  isClose?: boolean;
}

export const WindowHeader = memo(() => {
  const [isMaximized, setIsMaximized] = useState(false);
  const appWindow = getCurrentWindow();
  const [isMac] = useState(() => getOsType() === "macos");

  useEffect(() => {
    const updateState = async () =>
      setIsMaximized(await appWindow.isMaximized());
    updateState();
    const unlisten = appWindow.onResized(updateState);
    return () => {
      unlisten.then((f) => f());
    };
  }, [appWindow]);

  return (
    // 👇 核心：border-b 确立了顶栏的横向主体地位
    // 使用 /30 透明度让边框看起来更柔和，不至于像一根刺眼的白杠
    <header className="flex w-full h-10 shrink-0 z-50 border-b border-sidebar-border/30 bg-header-bg transition-colors duration-300">
      {/* 🔴 左侧区域：红绿灯占位 (视觉上延伸自侧边栏颜色) */}
      <div
        data-tauri-drag-region
        className={cn(
          "w-17 shrink-0 h-full",
          "bg-sidebar-bg",
          // ✅ 这里不再加 border-r，让视觉在横向上是连续的
          "flex items-center justify-center",
        )}
      >
        {/* Windows 模式下可以在这里放一个非常淡的 Logo 文字 */}
        {!isMac && (
          <span className="font-serif italic font-bold text-sidebar-fg/30 text-[10px] tracking-widest">
            VIRGANOL
          </span>
        )}
      </div>

      {/* ⚪️ 右侧区域：窗口控制功能 */}
      <div
        data-tauri-drag-region
        className={cn(
          "flex-1 flex items-center justify-end px-4 h-full",
          "text-header-fg",
        )}
      >
        {!isMac && (
          <div className="flex items-center gap-1 pointer-events-none">
            <WinBtn onClick={() => appWindow.minimize()}>
              <Minus size={14} />
            </WinBtn>
            <WinBtn
              onClick={async () => {
                await appWindow.toggleMaximize();
                setIsMaximized(await appWindow.isMaximized());
              }}
            >
              {isMaximized ? <Maximize2 size={12} /> : <Square size={12} />}
            </WinBtn>
            <WinBtn onClick={() => appWindow.close()} isClose>
              <X size={14} />
            </WinBtn>
          </div>
        )}
      </div>
    </header>
  );
});

const WinBtn = ({ children, onClick, isClose }: WindowControlBtnProps) => (
  <button
    onClick={onClick}
    className={cn(
      "h-7 w-7 rounded-md flex items-center justify-center transition-all duration-200",
      "pointer-events-auto",
      isClose
        ? "hover:bg-rose-500 hover:text-white"
        : "text-header-fg/60 hover:text-header-fg hover:bg-header-fg/10",
    )}
  >
    {children}
  </button>
);
