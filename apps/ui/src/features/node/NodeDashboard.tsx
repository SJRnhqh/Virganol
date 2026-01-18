import { NodeCanvas } from "@/components/canvas/NodeCanvas";
import { AddServerCard } from "@/components/AddServerCard";


export const NodeDashboard = () => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 1. 核心层：React Flow 画布 */}
      <NodeCanvas />
      {/* 2. 交互层：只属于 Node 模块的浮动按钮 */}
      <div className="absolute bottom-8 right-8 z-10">
        <AddServerCard />
      </div>
    </div>
  )
}