import { NodeCanvas } from "@/components/canvas/NodeCanvas";
import { TerminalWorkspace } from "@/features/terminal/TerminalWorkspace";
// import { AddServerCard } from "@/components/cards/AddServerCard";
// import { BaseActionDock } from "@/components/base/BaseActionDock"; // 引入底座

export const NodeDashboard = () => {
  return (
    /* 🌟 使用 isolate 开启独立的堆叠上下文，bg-main-bg 由 MainLayout 提供 */
    <div className="relative w-full h-full overflow-hidden isolate">
      {/* 第 1 层：业务视图层 (Work Surface) - 永远在底层 */}
      <div className="absolute inset-0 z-0">
        <NodeCanvas />
      </div>
      {/* 2. 终端工作区 (悬浮层) */}
      <TerminalWorkspace />
    </div>
  );
};
