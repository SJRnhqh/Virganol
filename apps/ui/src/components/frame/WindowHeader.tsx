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
  const [osType] = useState(() => getOsType());
  const isMac = osType === "macos";

  useEffect(() => {
    const updateState = async () =>
      setIsMaximized(await appWindow.isMaximized());
    updateState();
    const unlisten = appWindow.onResized(updateState);
    return () => {
      unlisten.then((f) => f());
    };
  }, [appWindow]);

  if (isMac) {
    // Mac 占位符也使用透明语义
    // Old: bg-transparent -> New: bg-header-bg (如果我们在 CSS 里定义 header 是透明的，这里也一样)
    return <div className="h-4 w-full bg-header-bg pointer-events-none" />;
  }

  return (
    <header
      data-tauri-drag-region
      className={cn(
        "flex items-center justify-end shrink-0",
        "h-10 w-full px-4",

        // 👇 1. 容器样式替换
        // Old: bg-[#FAF7F0] -> New: bg-header-bg (读取 CSS 里的 --header-bg)
        // Old: text-[#2F3E46] -> New: text-header-fg (读取 CSS 里的 --header-fg)
        "bg-header-bg text-header-fg",

        "z-40 transition-colors duration-300", // 加上过渡动画
      )}
    >
      <div className="flex items-center gap-2 pointer-events-auto">
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
    </header>
  );
});

// 👇 2. 按钮样式替换
const WinBtn = ({ children, onClick, isClose }: WindowControlBtnProps) => (
  <button
    onClick={onClick}
    className={cn(
      "h-7 w-7 rounded-md flex items-center justify-center transition-all duration-200",
      isClose
        ? "hover:bg-rose-500 hover:text-white"
        : // 👇 这里做了更高级的适配：
          // Old: text-[#2F3E46]/80 -> New: text-header-fg/80 (使用语义变量)
          // Old: hover:bg-black/5  -> New: hover:bg-header-fg/10 (使用前景色作为 Hover 背景，这样深色/浅色模式都通用)
          "text-header-fg/80 hover:text-header-fg hover:bg-header-fg/10",
    )}
  >
    {children}
  </button>
);
