import { CanvasWorkspace } from "../canvas/CanvasWorkspace";
import { AddServerCard } from "@/components/AddServerCard";

// 确保该文件只导出这一个组件，以满足 Fast Refresh 规范
export const SshDashboard = () => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 1. 核心层：React Flow 画布 */}
      <CanvasWorkspace />

      {/* 2. 交互层：只属于 Node 模块的浮动按钮 */}
      <div className="absolute bottom-8 right-8 z-10">
        <AddServerCard />
      </div>

      {/* 3. 装饰层：Network Orchestrator 文本标识 */}
      <div className="absolute top-6 left-6 pointer-events-none select-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-sm font-bold tracking-widest text-primary/80 uppercase">
            Network Orchestrator
          </h1>
          <p className="text-[10px] text-primary/30 font-medium uppercase tracking-tighter">
            V.I.N.E. Node Lab / Active
          </p>
        </div>
      </div>
    </div>
  );
};