import { NodeCanvas } from "@/components/canvas/NodeCanvas";
import { AddServerCard } from "@/components/cards/AddServerCard";


export const NodeDashboard = () => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 1. 核心层：React Flow 画布 */}
      <NodeCanvas />
      {/* 2. 交互层：只属于 Node 模块的浮动按钮 */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2">
        <AddServerCard />
      </div>
    </div>
  )
}