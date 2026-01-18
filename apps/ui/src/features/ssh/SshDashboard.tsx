import { CanvasWorkspace } from "../canvas/CanvasWorkspace";

export const SshDashboard = () => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-main-bg">
      {/* 1. 核心层：Canvas 逻辑 */}
      <CanvasWorkspace />
    </div>
  );
};
