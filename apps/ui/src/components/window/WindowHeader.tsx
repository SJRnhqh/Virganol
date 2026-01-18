import { memo, useState, useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { type as getOsType } from "@tauri-apps/plugin-os";
import { Minus, Square, X, Maximize2 } from "lucide-react";

export const WindowHeader = memo(() => {
  const [isMaximized, setIsMaximized] = useState(false);
  const appWindow = getCurrentWindow();

  const [osType] = useState(() => getOsType());

  useEffect(() => {
    const checkMaximized = async () => {
      setIsMaximized(await appWindow.isMaximized());
    };
    checkMaximized();

    const unlisten = appWindow.onResized(async () => {
      setIsMaximized(await appWindow.isMaximized());
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, [appWindow]);

  const handleMinimize = () => appWindow.minimize();
  const handleMaximize = async () => {
    await appWindow.toggleMaximize();
    setIsMaximized(await appWindow.isMaximized());
  };
  const handleClose = () => appWindow.close();

  const isMac = osType === "macos";

  return (
    <header
      data-tauri-drag-region
      className={`
            h-10 w-full flex items-end justify-between
            bg-[#84A59D] border-b border-[#E6E1D3]/30 select-none z-50 shrink-0 relative shadow-sm transition-all
            /* 👈 调整点：极限左移
               - Mac: pl-64px (紧贴红绿灯安全区，如果觉得太挤可以改回 64px)
               - Windows: pl-3 (12px)
            */
            ${isMac ? "pl-64px pr-3" : "pl-3 pr-2"}
          `}
    >
      {/* === 左侧核心区域 === */}
      <div className="flex items-end gap-5 h-full">
        {/* 1. 品牌 Logo */}
        {/* pb-2.5: 因为是 items-end，我们需要把文字稍微垫高一点，保持视觉垂直居中 */}
        <div className="flex items-center pb-2.5 pointer-events-none opacity-90">
          <span className="text-lg font-serif italic text-white tracking-tight leading-none">
            Virganol
          </span>
        </div>

        {/* 2. 激活的 Tab：Node Deck */}
        {/* - bg-[#FAF7F0]: 背景色与 MainLayout 画布完全一致
            - rounded-t-lg: 顶部圆角，像浏览器的标签页
            - text-[#2F3E46]: 深色文字，高对比度
            - h-[75%]: 占据 Header 高度的 75%，底部对齐
        */}
        <div className="relative h-full flex items-end">
          <div
            className="
            flex items-center gap-2
            px-4 h-7 mb-0
            bg-[#FAF7F0]
            rounded-t-md
            shadow-[0_-1px_2px_rgba(0,0,0,0.05)]
            cursor-default
          "
          >
            <span className="text-[10px] font-bold text-[#2F3E46] tracking-widest uppercase font-mono">
              Node Deck
            </span>
            {/* 可选：加个绿色小圆点表示在线/活跃 */}
            <div className="w-1.5 h-1.5 rounded-full bg-[#84A59D]/80" />
          </div>
        </div>
      </div>

      {/* === 右侧窗口控制 (仅 Windows/Linux) === */}
      {/* pb-1.5: 底部对齐时，按钮也需要稍微垫高 */}
      {!isMac && (
        <div className="flex items-center gap-1 pb-1.5">
          <button onClick={handleMinimize} className="window-btn">
            <Minus size={14} strokeWidth={3} />
          </button>
          <button onClick={handleMaximize} className="window-btn">
            {isMaximized ? (
              <Maximize2 size={12} strokeWidth={3} />
            ) : (
              <Square size={12} strokeWidth={3} />
            )}
          </button>
          <button
            onClick={handleClose}
            className="window-btn hover:bg-rose-500/80！ hover:text-white！"
          >
            <X size={14} strokeWidth={3} />
          </button>
        </div>
      )}

      <style>{`
        .window-btn {
          padding: 6px;
          border-radius: 6px;
          color: rgba(255,255,255,0.7);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          outline: none;
          cursor: pointer;
        }
        .window-btn:hover {
          background-color: rgba(255,255,255,0.15);
          color: white;
        }
      `}</style>
    </header>
  );
});
