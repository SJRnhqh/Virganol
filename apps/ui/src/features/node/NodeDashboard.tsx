// src/features/node/NodeDashboard.tsx
import { NodeCanvas, NodeTerminalDock } from "./components";
import { useTerminalStore } from "@/store/TerminalStore";

export const NodeDashboard = () => {
  // 1. 只需要监听 isOpen，决定是否把终端层渲染出来
  // 细节：不用在这里监听 isMaximized，因为那是由 Dock 内部样式处理的
  const { isOpen } = useTerminalStore();
  return (
    /* 🌟 容器层：使用 isolate 开启独立的堆叠上下文 */
    <div className="relative w-full h-full overflow-hidden isolate bg-[#121212]">
      {/* 🟦 第 1 层：业务视图层 (Canvas) - 永远在底层 */}
      <div className="absolute inset-0 z-0">
        <NodeCanvas />
      </div>
      {/* 🟧 第 2 层：终端界面层 (Overlay) - 永远在顶层 */}
      {/* pointer-events-none: 关键！让这一层的透明区域允许鼠标穿透点击底下的 Canvas */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-end">
        {isOpen && (
          // 终端坞容器
          // pointer-events-auto: 恢复鼠标交互，否则无法点击终端
          // h-[35%]: 默认高度占屏幕 35%
          // animate-slide-up: 进场动画 (需在 tailwind 配置)
          <div className="w-full h-[35%] min-h-75 pointer-events-auto shadow-2xl transition-all duration-300">
            <NodeTerminalDock />
          </div>
        )}
      </div>
    </div>
  );
};
