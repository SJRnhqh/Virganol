import { memo, useState, useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { type as getOsType } from "@tauri-apps/plugin-os";
import { Minus, Square, X, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <header className="flex w-full h-10 shrink-0 z-50 border-b border-sidebar-border/30 bg-header-bg">
      {/* 🔴 确保宽度严格对齐 64px */}
      <div
        data-tauri-drag-region
        className="w-16 shrink-0 h-full bg-sidebar-bg border-r border-sidebar-border/10"
      />

      <div
        data-tauri-drag-region
        className="flex-1 flex items-center justify-end px-4 h-full"
      >
        {!isMac && (
          <div className="flex items-center gap-1.5 pointer-events-none">
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

// 1. 定义 Props 的类型接口
interface WinBtnProps {
  children: React.ReactNode; // React 节点类型
  onClick: () => void; // 无参数无返回值的函数
  isClose?: boolean; // 可选的布尔值
}

// 2. 将 any 替换为 WinBtnProps
const WinBtn = ({ children, onClick, isClose = false }: WinBtnProps) => (
  <button
    onClick={onClick}
    className={cn(
      "h-7 w-7 rounded-md flex items-center justify-center transition-all duration-200 pointer-events-auto",
      isClose
        ? "hover:bg-rose-500 hover:text-white"
        : "text-header-fg/60 hover:text-header-fg hover:bg-header-fg/10",
    )}
  >
    {children}
  </button>
);
